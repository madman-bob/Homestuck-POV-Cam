from collections import defaultdict, OrderedDict
import re

from timeline_compiler.objects import Person


class Timeline:
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

    def __init__(self):
        self.colours = []
        self.images = []
        self.groups = []

        self.people = OrderedDict()
        self.next_page_links = defaultdict(list)

    def get_person(self, person_name):
        if person_name not in self.people:
            self.people[person_name] = Person(len(self.people), person_name)
        return self.people[person_name]

    @classmethod
    def tokenize_timeline_file(cls, timeline_file_location):
        with open(timeline_file_location, 'r') as timeline_file:
            yield from cls.tokenize_timeline_statements(timeline_file)

    @classmethod
    def tokenize_timeline_statements(cls, statements):
        indent_level = 0
        for line in statements:
            potential_command = line.strip()
            pattern_match = next((pattern for pattern in cls.patterns if cls.patterns[pattern].match(potential_command)), None)

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
