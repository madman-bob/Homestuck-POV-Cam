from collections import defaultdict, OrderedDict

people = OrderedDict()

class person:
	def __init__(self, _name):
		self.name = _name
		if not _name in people:
			people[_name] = self
		self.personID = list(people.keys()).index(_name)
		
		self.firstPage = None
		self.lastPages = []
	
	def __str__(self):
		return str(self.name)

def getPerson(personName):
	if personName in people:
		return people[personName]
	else:
		return person(personName)

nextPageLinks = defaultdict(list)

class link:
	def __init__(self, _currentPageNumber, _person = None, _colourID = None, _imageID = None, _groupID = None):
		self.currentPageNumber = _currentPageNumber
		self.person = _person
		self.colourID = _colourID
		self.imageID = _imageID
		self.groupID = _groupID
		self.nextLinks = []
		self.nextLinkCaptions = []
		
		if type(_person) is person and _person.firstPage == None:
			_person.firstPage = self
		
		nextPageLinks[_currentPageNumber].append(self)
	
	def __str__(self):
		return str(self.currentPageNumber) + " ==> " + \
			str([nextLink.currentPageNumber if type(nextLink) is link else nextLink for nextLink in self.nextLinks]) + ": " + \
			str(self.person) + " " + str(self.colourID) + " " + str(self.imageID)
	
	def linkTo(self, nextLink, caption = None):
		self.nextLinks.append(nextLink)
		self.nextLinkCaptions.append(caption)
	
	def outputForJS(self):
		nextLinks = (nextLink if type(nextLink) is link else getPerson(nextLink).firstPage for nextLink in self.nextLinks)
		return str([self.person.personID, self.colourID, self.imageID, self.groupID, [[nextLink.currentPageNumber, nextPageLinks[nextLink.currentPageNumber].index(nextLink)] + ([caption] if caption != None else []) for nextLink, caption in zip(nextLinks, self.nextLinkCaptions)]]).replace(" ", "")