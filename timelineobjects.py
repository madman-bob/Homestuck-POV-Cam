from collections import defaultdict, OrderedDict

from timeline_compiler.objects import Person

people = OrderedDict()


def get_person(person_name):
    if person_name not in people:
        people[person_name] = Person(len(people), person_name)
    return people[person_name]


next_page_links = defaultdict(list)


class Link:
    def __init__(self, current_page_number, person=None, colour_id=None, image_id=None, group_id=None):
        self.current_page_number = current_page_number
        self.person = person
        self.colour_id = colour_id
        self.image_id = image_id
        self.group_id = group_id
        self.next_links = []
        self.next_link_captions = []

        if isinstance(person, Person) and person.first_page is None:
            person.first_page = self

        next_page_links[current_page_number].append(self)

    def __str__(self):
        return str(self.current_page_number) + " ==> " + \
               str([next_link.current_page_number if isinstance(next_link, Link) else next_link for next_link in self.next_links]) + ": " + \
               str(self.person) + " " + str(self.colour_id) + " " + str(self.image_id)

    def link_to(self, next_link, caption=None):
        self.next_links.append(next_link)
        self.next_link_captions.append(caption)

    def output_for_js(self):
        next_links = (next_link if isinstance(next_link, Link) else get_person(next_link).first_page for next_link in self.next_links)
        return str([
            self.person.person_id, self.colour_id, self.image_id, self.group_id,
            [
                [next_link.current_page_number, next_page_links[next_link.current_page_number].index(next_link)] + ([caption] if caption is not None else [])
                for next_link, caption in zip(next_links, self.next_link_captions)
            ]
        ]).replace(" ", "")
