from os import path

from timeline_compiler import compile_timelines

if __name__ == "__main__":
    current_location = path.dirname(__file__)
    compile_timelines(
        timelines_directory=path.join(current_location, "Readable Timelines"),
        expected_timelines_path=path.join(current_location, "timelineexpectedpeople.txt"),
        images_directory=path.join(current_location, "POV Cam", "images"),
        output_path=path.join(current_location, "POV Cam", "timelines.js")
    )
