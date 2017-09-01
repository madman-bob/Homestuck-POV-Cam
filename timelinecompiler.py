from os import listdir, path

from timeline_compiler.timeline import Timeline

if __name__ == "__main__":
    # Get order of expected people from designated file
    # Read timelines in order
    # Check expected images present

    timeline = Timeline()

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
                timeline.add_timeline(path.join(current_location, "Readable Timelines", name))

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
