from os import listdir, path
import re

from timelineobjects import *

patterns = {
	"Pages": re.compile("^\d+(-\d+(-2)?)?$"),
	"==>": re.compile("^=+>$"),
	"<==": re.compile("^<=+$"),
	"GOTO": re.compile("^~\s*[A-Z0-9_ ]+$", re.IGNORECASE),
	"Name": re.compile("^Name:\s*[A-Z ()']+$", re.IGNORECASE),
	"Colour": re.compile("^Colour:\s*#[0-9A-F]{6}$", re.IGNORECASE),
	"Image": re.compile("^Image:\s*\w+\.\w+$", re.IGNORECASE),
	"Group": re.compile("^Group:\s*[A-Z ()']+$", re.IGNORECASE),
	"Caption": re.compile("^Caption:\s*[A-Z0-9_ ]+$", re.IGNORECASE)
}

def parsePersonFile(fileLocation):
	indentLevel = 0
	with open(fileLocation, "r") as personFile:
		for line in personFile:
			potentialCommand = line.strip()
			patternMatch = next((pattern for pattern in patterns if patterns[pattern].match(potentialCommand)), None)
			if patternMatch:
				# Good enough in most cases
				# May want to improve later
				nextIndentLevel = len(line) - len(line.lstrip())
				if nextIndentLevel > indentLevel:
					yield ("BOT",)
				elif nextIndentLevel < indentLevel:
					yield ("EOT",)
				indentLevel = nextIndentLevel
			
			if patternMatch == "Pages":
				command = [patternMatch] + [int(s) for s in potentialCommand.split("-")]
				if len(command) == 2:
					command.append(command[1])
				command[2] += 1
				yield tuple(command)
			elif patternMatch == "GOTO":
				yield (patternMatch, potentialCommand[1:].strip())
			elif patternMatch in {"Name", "Colour", "Image", "Group", "Caption"}:
				yield (patternMatch, potentialCommand.split(":")[1].strip())
			elif patternMatch != None:
				yield (patternMatch,)
	yield ("EOT",)

colours = []
images = []
groups = []

def parsePersonTokens(commandIterator, previousPages = None, currentPerson = None, currentColour = None, currentImage = None, currentGroup = None, nextCaption = None):
	# Page to pass into next splinter timeline
	splinterPages = []
	# Page returned from splinter timeline
	returnPage = None
	
	if previousPages == None:
		previousPages = []
	
	for command in commandIterator:
		if command[0] == "Pages":
			for pageNumber in range(*command[1:]):
				nextLink = link(pageNumber, currentPerson, currentColour, currentImage, currentGroup)
				for page in previousPages:
					page.linkTo(nextLink, nextCaption)
				previousPages = [nextLink]
				nextCaption = None
		elif command[0] == "==>":
			splinterPages = previousPages
		elif command[0] == "<==":
			previousPages.extend(returnPages)
		elif command[0] == "GOTO":
			for page in previousPages:
				page.linkTo(command[1])
			previousPages = [link(command[1])]
			nextCaption = None
		elif command[0] == "EOT":
			currentPerson.lastPages = previousPages
			return previousPages
		elif command[0] == "BOT":
			returnPages = parsePersonTokens(commandIterator, splinterPages, currentPerson, currentColour, currentImage, currentGroup)
			splinterPages = []
		elif command[0] == "Name":
			currentPerson = getPerson(command[1])
		elif command[0] == "Colour":
			if not command[1] in colours:
				colours.append(command[1])
			currentColour = colours.index(command[1])
		elif command[0] == "Image":
			if not command[1] in images:
				images.append(command[1])
			currentImage = images.index(command[1])
		elif command[0] == "Group":
			if not command[1] in groups:
				groups.append(command[1])
			currentGroup = groups.index(command[1])
		elif command[0] == "Caption":
			nextCaption = command[1]

if __name__ == "__main__":
	# Get order of expected people from designated file
	# Read timelines in order
	# Check expected images present
	
	currentlocation = path.dirname(__file__)
	
	peopleWithFiles = set(listdir(path.join(currentlocation, "Readable Timelines")))
	expectedPeople = set()
	
	# Get information from files
	with open(path.join(currentlocation, "timelineexpectedpeople.txt"), "r") as peopleFile:
		for line in peopleFile:
			if line.strip() != "":
				name = line.strip() + ".txt"
				expectedPeople.add(name)
				if name in peopleWithFiles:
					parsePersonTokens(parsePersonFile(path.join(currentlocation, "Readable Timelines", name)))
	
	# Pass through, replacing links from relative locations with absolute locations
	# (Note: still have links to relative locations)
	for personName in people:
		if personName in nextPageLinks:
			for page in nextPageLinks[personName]:
				for nextLink in page.nextLinks:
					for lastPage in people[personName].lastPages:
						lastPage.linkTo(nextLink)
			del nextPageLinks[personName]
	
	missingJumps = [pageNumber for pageNumber in nextPageLinks if type(pageNumber) is str]
	if missingJumps:
		print("Missing required jumps:")
		print(missingJumps)
		raise Exception("")
	
	# Now write it to file
	with open(path.join(currentlocation, "POV Cam", "timelines.js"), "w") as outputfile:
		outputfile.write("peoplenames = ")
		outputfile.write(str(list(people.keys())))
		outputfile.write(";\n")
		
		outputfile.write("colours = ")
		outputfile.write(str(colours))
		outputfile.write(";\n")
		
		outputfile.write("images = ")
		outputfile.write(str(images))
		outputfile.write(";\n")
		
		outputfile.write("groups = ")
		outputfile.write(str(groups))
		outputfile.write(";\n")
		
		outputfile.write("\ntimelines = {")
		for pageNumber in sorted(nextPageLinks.keys()):
			outputfile.write("\n\t" + str(pageNumber) + ": [")
			for l in nextPageLinks[pageNumber]:
				outputfile.write(l.outputForJS())
				outputfile.write(",")
			outputfile.write("],")
		outputfile.write("\n}")
	
	# Any errors?
	print("Problems:")
	
	existingImages = set(listdir(path.join(currentlocation, "POV Cam", "images")))
	for image in images:
		if image in existingImages:
			existingImages.remove(image)
		else:
			print(image + " is missing")
	for image in existingImages:
		print(image + " is not expected")
	
	for person in peopleWithFiles.symmetric_difference(expectedPeople):
		if person in peopleWithFiles:
			print(person + " is not expected")
		else:
			print(person + " is missing")