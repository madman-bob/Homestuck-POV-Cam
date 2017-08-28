from collections import defaultdict, OrderedDict

from timeline_compiler.objects import Person


class Timeline:
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
