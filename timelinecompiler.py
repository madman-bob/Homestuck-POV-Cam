from os import listdir, path
import re

from timelineobjects import *

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


def parse_person_file(file_location):
    indent_level = 0
    with open(file_location, "r") as person_file:
        for line in person_file:
            potential_command = line.strip()
            pattern_match = next((pattern for pattern in patterns if patterns[pattern].match(potential_command)), None)
            if pattern_match:
                # Good enough in most cases
                # May want to improve later
                next_indent_level = len(line) - len(line.lstrip())
                if next_indent_level > indent_level:
                    yield ("BOT",)
                elif next_indent_level < indent_level:
                    yield ("EOT",)
                indent_level = next_indent_level

            if pattern_match == "Pages":
                command = [pattern_match] + [int(s) for s in potential_command.split("-")]
                if len(command) == 2:
                    command.append(command[1])
                command[2] += 1
                yield tuple(command)
            elif pattern_match == "GOTO":
                yield (pattern_match, potential_command[1:].strip())
            elif pattern_match in {"Name", "Colour", "Image", "Group", "Caption"}:
                yield (pattern_match, potential_command.split(":")[1].strip())
            elif pattern_match is not None:
                yield (pattern_match,)
    yield ("EOT",)


colours = []
images = []
groups = []


def parse_person_tokens(command_iterator, previous_pages=None, current_person=None, current_colour=None, current_image=None, current_group=None, next_caption=None):
    # Page to pass into next splinter timeline
    splinter_pages = []
    # Page returned from splinter timeline
    return_page = None

    if previous_pages is None:
        previous_pages = []

    for command in command_iterator:
        if command[0] == "Pages":
            for page_number in range(*command[1:]):
                next_link = Link(page_number, current_person, current_colour, current_image, current_group)
                for page in previous_pages:
                    page.link_to(next_link, next_caption)
                previous_pages = [next_link]
                next_caption = None
        elif command[0] == "==>":
            splinter_pages = previous_pages
        elif command[0] == "<==":
            previous_pages.extend(return_pages)
        elif command[0] == "GOTO":
            for page in previous_pages:
                page.link_to(command[1])
            previous_pages = [Link(command[1])]
            next_caption = None
        elif command[0] == "EOT":
            current_person.last_pages = previous_pages
            return previous_pages
        elif command[0] == "BOT":
            return_pages = parse_person_tokens(command_iterator, splinter_pages, current_person, current_colour, current_image, current_group)
            splinter_pages = []
        elif command[0] == "Name":
            current_person = get_person(command[1])
        elif command[0] == "Colour":
            if not command[1] in colours:
                colours.append(command[1])
            current_colour = colours.index(command[1])
        elif command[0] == "Image":
            if not command[1] in images:
                images.append(command[1])
            current_image = images.index(command[1])
        elif command[0] == "Group":
            if not command[1] in groups:
                groups.append(command[1])
            current_group = groups.index(command[1])
        elif command[0] == "Caption":
            next_caption = command[1]


if __name__ == "__main__":
    # Get order of expected people from designated file
    # Read timelines in order
    # Check expected images present

    current_location = path.dirname(__file__)

    people_with_files = set(listdir(path.join(current_location, "Readable Timelines")))
    expected_people = set()

    # Get information from files
    with open(path.join(current_location, "timelineexpectedpeople.txt"), "r") as people_file:
        for line in people_file:
            if line.strip() != "":
                name = line.strip() + ".txt"
                expected_people.add(name)
                if name in people_with_files:
                    parse_person_tokens(parse_person_file(path.join(current_location, "Readable Timelines", name)))

    # Pass through, replacing links from relative locations with absolute locations
    # (Note: still have links to relative locations)
    for person_name in people:
        if person_name in next_page_links:
            for page in next_page_links[person_name]:
                for next_link in page.next_links:
                    for last_page in people[person_name].last_pages:
                        last_page.link_to(next_link)
            del next_page_links[person_name]

    missing_jumps = [page_number for page_number in next_page_links if isinstance(page_number, str)]
    if missing_jumps:
        print("Missing required jumps:")
        print(missing_jumps)
        raise Exception("")

    # Now write it to file
    with open(path.join(current_location, "POV Cam", "timelines.js"), "w") as output_file:
        output_file.write("peoplenames = ")
        output_file.write(str(list(people.keys())))
        output_file.write(";\n")

        output_file.write("colours = ")
        output_file.write(str(colours))
        output_file.write(";\n")

        output_file.write("images = ")
        output_file.write(str(images))
        output_file.write(";\n")

        output_file.write("groups = ")
        output_file.write(str(groups))
        output_file.write(";\n")

        output_file.write("\ntimelines = {")
        for page_number in sorted(next_page_links.keys()):
            output_file.write("\n\t" + str(page_number) + ": [")
            for l in next_page_links[page_number]:
                output_file.write(l.output_for_js())
                output_file.write(",")
            output_file.write("],")
        output_file.write("\n}")

    # Any errors?
    print("Problems:")

    existing_images = set(listdir(path.join(current_location, "POV Cam", "images")))
    for image in images:
        if image in existing_images:
            existing_images.remove(image)
        else:
            print(image + " is missing")
    for image in existing_images:
        print(image + " is not expected")

    for person in people_with_files.symmetric_difference(expected_people):
        if person in people_with_files:
            print(person + " is not expected")
        else:
            print(person + " is missing")
