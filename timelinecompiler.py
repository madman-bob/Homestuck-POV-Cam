from os import listdir, path
import re

from timeline_compiler.objects import Person, Link
from timeline_compiler.timeline import Timeline

timeline = Timeline()

patterns = {
    "Pages": re.compile("^\d+(-\d+(-2)?)?$"),
    "==>": re.compile("^=+>$"),
    "<==": re.compile("^<=+$"),
    "GOTO": re.compile("^~\s*[\w ()'^]+$", re.IGNORECASE),
    "Name": re.compile("^Name:\s*[\w ()'^]+$", re.IGNORECASE),
    "Colour": re.compile("^Colour:\s*#[0-9A-F]{6}$", re.IGNORECASE),
    "Image": re.compile("^Image:\s*\w+\.\w+$", re.IGNORECASE),
    "Group": re.compile("^Group:\s*[\w ()']+$", re.IGNORECASE),
    "Caption": re.compile("^Caption:\s*[\w ]+$", re.IGNORECASE)
}


def tokenize_person_file(file_location):
    indent_level = 0
    with open(file_location, "r") as person_file:
        for line in person_file:
            potential_command = line.strip()
            pattern_match = next((pattern for pattern in patterns if patterns[pattern].match(potential_command)), None)

            if pattern_match is None:
                continue

            # Good enough in most cases
            # May want to improve later
            next_indent_level = len(line) - len(line.lstrip())
            if next_indent_level > indent_level:
                yield ("BOT",)
            elif next_indent_level < indent_level:
                yield ("EOT",)
            indent_level = next_indent_level

            if pattern_match == "Pages":
                args = [int(s) for s in potential_command.split("-")]
                if len(args) == 1:
                    args.append(args[0])
                args[1] += 1
                yield (pattern_match,) + tuple(args)

            elif pattern_match == "GOTO":
                yield (pattern_match, potential_command[1:].strip())

            elif pattern_match in {"Name", "Colour", "Image", "Group", "Caption"}:
                yield (pattern_match, potential_command.split(":")[1].strip())

            else:
                yield (pattern_match,)

    yield ("EOT",)


def parse_person_tokens(command_iterator, previous_pages=None, current_person=None, current_colour=None, current_image=None, current_group=None, next_caption=None):
    # Page to pass into next splinter timeline
    splinter_pages = []
    # Page returned from splinter timeline
    return_pages = []

    if previous_pages is None:
        previous_pages = []

    for command, *args in command_iterator:
        if command == "Pages":
            for page_number in range(*args):
                next_link = Link(page_number, current_person, current_colour, current_image, current_group)

                if isinstance(current_person, Person) and current_person.first_page is None:
                    current_person.first_page = next_link

                timeline.next_page_links[page_number].append(next_link)

                for page in previous_pages:
                    page.link_to(next_link, next_caption)
                previous_pages = [next_link]
                next_caption = None

        elif command == "==>":
            splinter_pages = previous_pages

        elif command == "<==":
            previous_pages.extend(return_pages)

        elif command == "GOTO":
            for page in previous_pages:
                page.link_to(args[0])
            previous_pages = [Link(args[0])]
            timeline.next_page_links[args[0]].append(previous_pages[0])
            next_caption = None

        elif command == "EOT":
            current_person.last_pages = previous_pages
            return previous_pages

        elif command == "BOT":
            return_pages = parse_person_tokens(command_iterator, splinter_pages, current_person, current_colour, current_image, current_group)
            splinter_pages = []

        elif command == "Name":
            current_person = timeline.get_person(args[0])

        elif command == "Colour":
            if not args[0] in timeline.colours:
                timeline.colours.append(args[0])
            current_colour = timeline.colours.index(args[0])

        elif command == "Image":
            if not args[0] in timeline.images:
                timeline.images.append(args[0])
            current_image = timeline.images.index(args[0])

        elif command == "Group":
            if not args[0] in timeline.groups:
                timeline.groups.append(args[0])
            current_group = timeline.groups.index(args[0])

        elif command == "Caption":
            next_caption = args[0]


if __name__ == "__main__":
    # Get order of expected people from designated file
    # Read timelines in order
    # Check expected images present

    current_location = path.dirname(__file__)

    timeline_file_locations = set(listdir(path.join(current_location, "Readable Timelines")))
    expected_timelines = set()

    # Get information from files
    with open(path.join(current_location, "timelineexpectedpeople.txt"), "r") as timeline.people_file:
        for line in timeline.people_file:
            if not line.strip():
                continue

            name = line.strip() + ".txt"
            expected_timelines.add(name)
            if name in timeline_file_locations:
                parse_person_tokens(tokenize_person_file(path.join(current_location, "Readable Timelines", name)))

    # Pass through, replacing links from relative locations with absolute locations
    # (Note: still have links to relative locations)
    for person_name in timeline.people:
        if person_name not in timeline.next_page_links:
            continue

        for page in timeline.next_page_links[person_name]:
            for next_link in page.next_links:
                for last_page in timeline.people[person_name].last_pages:
                    last_page.link_to(next_link)
        del timeline.next_page_links[person_name]

    missing_jumps = [page_number for page_number in timeline.next_page_links if isinstance(page_number, str)]
    if missing_jumps:
        print("Missing required jumps:")
        print(missing_jumps)
        raise Exception("")

    # Now write it to file
    with open(path.join(current_location, "POV Cam", "timelines.js"), "w") as output_file:
        output_file.write("peoplenames = {};\n".format(list(timeline.people.keys())))
        output_file.write("colours = {};\n".format(timeline.colours))
        output_file.write("images = {};\n".format(timeline.images))
        output_file.write("groups = {};\n".format(timeline.groups))

        output_file.write("\ntimelines = {")
        for page_number in sorted(timeline.next_page_links.keys()):
            output_file.write("\n\t{}: [{}],".format(
                page_number,
                "".join(
                    l.output_for_js(timeline.get_person, timeline.next_page_links) + ","
                    for l in timeline.next_page_links[page_number]
                )
            ))
        output_file.write("\n}")

    # Any errors?
    print("Problems:")

    existing_images = set(listdir(path.join(current_location, "POV Cam", "images")))
    for image in timeline.images:
        if image in existing_images:
            existing_images.remove(image)
        else:
            print(image + " is missing")
    for image in existing_images:
        print(image + " is not expected")

    for person in timeline_file_locations.symmetric_difference(expected_timelines):
        if person in timeline_file_locations:
            print(person + " is not expected")
        else:
            print(person + " is missing")
