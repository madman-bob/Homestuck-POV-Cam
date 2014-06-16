# Available formats:
# Strings ignored
# 6009
# 1901-2032
# 7764-7804-2
# ~ doomeddave
# @ Kids

from collections import OrderedDict
from os import listdir, path

def parsePerson(personstring):
	# Convert the human readable timeline data to an intermediate stage
	pages = []
	persongroups = []
	for line in personstring.split("\n"):
		if line:
			if line[0] == "~":
				pages.append(line[2:])
			elif line[0] == "@":
				persongroups.append(line[2:])
			elif line[0].isdigit():
				p = line.split("-")
				if len(p) == 1:
					pages.append(int(p[0]))
				elif len(p) == 2:
					pages.append(list(range(int(p[0]), int(p[1]) + 1)))
				else:
					pages.append(list(range(int(p[0]), int(p[1]) + 1, int(p[2]))))
	return pages, persongroups

currentlocation = path.dirname(__file__)

# Get the names of the timelines we expect to find, and the order we want them in
coloursfile = open(path.join(currentlocation, "POV Cam", "colours.js"), "r")
colourslines = coloursfile.readlines()
coloursfile.close()
people = []
for line in colourslines:
	if line[:2] == "\t\"":
		people.append(line[2:line.find("\"", 2)])

# Read the timeline data
timelinefiles = listdir(path.join(currentlocation, "Readable Timelines"))
peopledata = OrderedDict()
peoplewithoutfiles = []
groups = OrderedDict()
groups["Other"] = []
for person in people:
	if (person + ".txt") in timelinefiles:
		timelinefiles.remove(person + ".txt")
		f = open(path.join(currentlocation, "Readable Timelines", person + ".txt"), "r")
		readstr = f.read()
		f.close()
		
		peopledata[person] = parsePerson(readstr)
		persongroups = peopledata[person][1]
		if persongroups:
			for persongroup in persongroups:
				if persongroup in groups:
					groups[persongroup].append(person)
				else:
					groups[persongroup] = [person]
		else:
			groups["Other"].append(person)
	else:
		peoplewithoutfiles.append(person)

# Do we need the group "Other"?
if groups["Other"]:
	groups.move_to_end("Other")
else:
	groups.pop("Other")

# Read the template for each person's timeline data
timelinetemplatefile = open(path.join(currentlocation, "timelinetemplate.js"), "r")
timelinetemplate = timelinetemplatefile.read()
timelinetemplatefile.close()

# Add the debug functions
timelinesfile = open(path.join(currentlocation, "POV Cam", "timelines.js"), "w")
timelinefunctionsfile = open(path.join(currentlocation, "timelinefunctions.js"), "r")
timelinesfile.write(timelinefunctionsfile.read())
timelinefunctionsfile.close()

# Write each person's timeline data to file
for person in peopledata:
	timelinesfile.write(timelinetemplate.format(person, 
		str(peopledata[person][0]).replace("[", "").replace("]", "").replace("\'", "\""),
		str(peopledata[person][1])[1:-1]
	))

timelinesfile.write("""	if (typeof modifypage != "undefined") {
		modifypage();
	}
});

groups = {""")

# Write the groups to file
lastgroup = list(groups)[-1]
for groupname in groups:
	timelinesfile.write("\n\t\"" + groupname + "\": [\n\t\t")
	timelinesfile.write(str(groups[groupname])[1:-1].replace("'", "\""))
	timelinesfile.write("\n\t]")
	if groupname != lastgroup:
		timelinesfile.write(",")

timelinesfile.write("\n}")
timelinesfile.close()

print("Timelines without colours:")
print("\n".join(timelinefiles))
print("Colours without timelines:")
print("\n".join(peoplewithoutfiles))
input("")