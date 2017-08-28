from collections import defaultdict, OrderedDict

from timeline_compiler.objects import Person

people = OrderedDict()


def get_person(person_name):
    if person_name not in people:
        people[person_name] = Person(len(people), person_name)
    return people[person_name]


next_page_links = defaultdict(list)
