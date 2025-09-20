const courses = [
    { name: "CSE 110", category: "cse", completed: true },
    { name: "CSE 111", category: "cse", completed: true },
    { name: "CSE 210", category: "cse", completed: true },
    { name: "WDD 130", category: "wdd", completed: true },
    { name: "WDD 131", category: "wdd", completed: true },
    { name: "WDD 231", category: "wdd", completed: false } // Not completed yet
];

const courseList = document.getElementById("course-list");
const courseCount = document.getElementById("course-count");
const buttons = document.querySelectorAll("nav button");

function displayCourses(filter) {
    courseList.innerHTML = "";
    const filtered = filter === "all" ? courses : courses.filter(c => c.category === filter);
    filtered.forEach(course => {
        const li = document.createElement("li");
        li.textContent = course.name;
        if (course.completed) {
            li.classList.add("completed");
        }
        courseList.appendChild(li);
    });
    courseCount.textContent = `The total number of courses listed below is ${filtered.length}`;
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        displayCourses(button.dataset.filter);
    });
});

// Initial load
displayCourses("all");

// Last modified date
document.getElementById("last-modified").textContent = document.lastModified;