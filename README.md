# Homestuck POV Cam

The POV Cam is a Chrome extension (found in the Chrome store [here](https://chrome.google.com/webstore/detail/homestuck-pov-cam/amojmegbfaaookabgifgaiblfdlgapoj)), which modifies the links of Homestuck so that one may follow the events from the point of view of a single character.

These links are displayed beneath the normal links, in the colour that that person types, and with a symbol of that person next to them. Clicking on that link takes you to the page, that that person goes to after this one.

Hovering over the links will show you the name of the person, and any further clarification as needed.

## Options

The POV Cam options page can be reached either by clicking on the `Options` link in the Chrome Extension Settings page, or by clicking on `POV Cam Options` beneath the links on any ordinary Homestuck page.

### Enabled timelines

This allows you to enable and disable groups of timelines at once, which is useful if you think the pages get a little cluttered. For example, if you only want to follow the Beta Kids, then you can uncheck all the timelines apart from them. You can even disable all timelines if you only want to use the other features of this extension.

### View pre-retcon pages

Pages that have been retconned are changed back to their original images. Hover over the image to revert to post-retcon.

### Add controls to (most) flash pages

Adds a scroll bar and a pause button to most flash pages. The scroll bar allows you to move to different parts of the flash. Unfortunately this doesn't work on Cascade due to domain restrictions.

### Other

Other features, which should be self explanitory, are the auto-opening of pesterlogs, using left and right arrow keys for navigation, highlighting Doc Scratch's text with a green background, and turning off the flashing of Lord English's links.

## Timeline language

In the `Readable Timelines` folder are a number of files, each containing the timeline data for a single person.

The files use the following format:

 * Page numbers or ranges of numbers to describe what pages a person's on.
   (For A6A5A1x2 COMBO, use `-2` on the end to go through the pages two at a time)
   eg. `6009`, `1901-2032`, or `7688-7692-2`
 * To split the timeline, indent the splintered timeline, then return to the original indentation for the alpha timeline.
   Note that the two timelines are not connected by default, you must use the next two commands to describe how they should be joined.
 * `==>`: Jump into the next split timeline from this point
 * `<==`: Jump out of previous split timeline to this point
 * `~`: Insert another timeline here, using a person's name.
   eg. `~ Davesprite`

The following commands change properties about the current person or timeline.
Write the exact word, then `:`, then the value you wish to set it to.
eg. `Name: John`.

 * `Name`: Change the name of the current person.
 * `Colour`: Change the colour used for the links.
 * `Image`: Change the image used for the links.
 * `Group`: Change which group the links are a part of.
 * `Caption`: Give some hover-over text to the link between the previous page and the next.

All lines which do not fit any of the above are ignored.
This allows you to comment on the timeline, without it effecting the resultant file.

### `timelines.js`

The Python script `timelinecompiler.py` then takes files of the above form to produce the Javascript file `timelines.js`.
The main contents of this file gives is the variable `timelines`, which describes the links between the various pages.

 * `timelines` is a dictionary, where the index is a page number.
   eg. `timelines[1901]` contains the information for links on page 1901.
 * Each page, `currentPage`, of `timelines` is an array of links to the next page/pages in a person's timeline.
 * Each of these links is a tuple of the format
   `Link = [NameID, ColourID, ImageID, GroupID, NextPages]`,
   where the various IDs are indices into the appropriate arrays.
 * Each page of `NextPages` is a tuple of the format
   `NextPage = [PageNumber, Index, Caption]`,
   where `PageNumber` is the number of the next page, `Index` is the index of that persons position in the links on that page, and `Caption` (if it exists) is the text that appears on hover-over.