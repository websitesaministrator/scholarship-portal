# BUILD A COMPLETE PERSONAL SCHOLARSHIP CRM / SCHOLARSHIP OS

Build a polished, production-ready personal web application called **Scholarship OS**.

This is a private scholarship application management system for a student from Pakistan taking a gap year and applying to international scholarships and university funding opportunities.

The application should function as a combination of:

* Scholarship CRM
* Deadline tracker
* Personal task manager
* Document manager
* Activities/achievement database
* Personal profile and story database
* Application preparation workspace

The main purpose of the application is to eliminate scattered notes, spreadsheets, reminders, and repeated information.

The application should make it immediately obvious:

**What scholarships am I applying to?**

**What is the next deadline?**

**What do I need to do today?**

**What do I need to finish this week?**

**What documents am I missing?**

**Which applications are incomplete?**

**What have I already accomplished?**

**What information can I reuse in my applications?**

The experience should be calm, minimal, extremely usable, and focused on execution.

Do not build a generic admin dashboard.

Build a focused personal operating system for scholarship applications.

---

# 1. TECHNOLOGY STACK

Use the following stack unless there is a strong technical reason to use an equivalent:

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### UI

* shadcn/ui
* Lucide icons

### Backend / Database

* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Storage

### Deployment

* Vercel

The application must use real persistent data.

Do not build a static HTML-only prototype.

The same data must be accessible from:

* Laptop
* Desktop
* Tablet
* Mobile phone

The user should be able to log in from another device and see exactly the same information.

---

# 2. OVERALL DESIGN PHILOSOPHY

The design should be minimal, modern, professional, calm, and highly functional.

The visual language should feel inspired by products such as:

* Linear
* Notion
* Things
* Raycast
* Modern CRM interfaces

Do not copy any product directly.

Use the following principles:

* Lots of whitespace
* Clean typography
* Simple hierarchy
* Neutral background
* Dark readable text
* One restrained accent color
* Subtle borders
* Minimal shadows
* Small rounded corners
* No excessive gradients
* No glassmorphism
* No unnecessarily flashy animations
* No giant hero sections
* No excessive use of icons
* No unnecessary decorative graphics

Use a clean font such as Inter.

The UI must prioritize information density without becoming visually overwhelming.

---

# 3. RESPONSIVE DESIGN

The application must be fully responsive.

Desktop should use a sidebar-based application shell.

Mobile should use a compact bottom navigation or another clean mobile navigation approach.

Do not simply shrink the desktop interface.

Design separate responsive layouts where appropriate.

The following must work well on mobile:

* Timeline
* Task management
* Adding scholarships
* Editing scholarships
* Adding documents
* Completing tasks
* Changing task dates
* Viewing application details
* Updating statuses
* Searching
* Filtering
* Uploading files

Buttons should have comfortable touch targets.

Forms should be easy to use on a phone.

---

# 4. AUTHENTICATION

Use Supabase Auth.

Implement:

* Login
* Logout
* Session persistence
* Protected application routes

The architecture must use a `user_id` on user-owned entities.

Use Supabase Row Level Security.

A user must only be able to access their own data.

---

# 5. MAIN APPLICATION NAVIGATION

Create the following main sections:

1. Dashboard
2. To-Do
3. Scholarships
4. Documents
5. Activities
6. Profile & Story

Optional secondary functionality can be accessible through contextual links rather than adding excessive navigation items.

---

# 6. DASHBOARD

The Dashboard is the command center.

When the user opens the application, they should immediately understand their current workload.

The dashboard should contain:

## A. Current date

Display the current date clearly.

Example:

Tuesday, September 23

Good morning, Dawood

Keep the greeting subtle, not overly decorative.

---

# 7. SCHOLARSHIP DEADLINE TIMELINE

Create the main scholarship timeline.

This is a core feature of the application.

The timeline should visually represent scholarship deadlines across time.

Desktop example:

September      October       November       December
|--------------|-------------|---------------|------------|
●
TODAY
● Scholarship A
● Scholarship B
● Scholarship C

The actual design should be significantly more polished.

Scholarship markers must be positioned according to the actual deadline date.

Display:

* Scholarship name
* Deadline
* Status
* Days remaining

Current date should have a very obvious marker.

Allow timeline views:

* This Month
* Next 3 Months
* Next 6 Months
* All Active

Allow horizontal scrolling on smaller screens.

Clicking a scholarship on the timeline should open its detail page or a detail drawer.

---

# 8. DASHBOARD TASK SUMMARY

Below or beside the timeline, prominently show the user's task workload.

Display:

### Today

Number of tasks due today.

### This Week

Number of tasks due during the current week.

### This Month

Number of tasks due during the current month.

Example:

Today
4 tasks

This Week
11 tasks

This Month
23 tasks

These should be interactive.

Clicking "Today" should open the To-Do page already filtered to Today.

---

# 9. DASHBOARD "NEEDS ATTENTION"

Create an intelligent attention section.

Examples:

* Scholarship deadline in 5 days
* Recommendation letter still missing
* Passport expires soon
* Personal statement incomplete
* 3 tasks overdue
* Application has incomplete requirements

Show only genuinely useful alerts.

Avoid creating noise.

---

# 10. DASHBOARD UPCOMING DEADLINES

Show a concise list of upcoming scholarship deadlines.

Each item should display:

* Scholarship
* Deadline
* Days remaining
* Current application status
* Requirement progress

Example:

Global Future Scholarship
Deadline: 18 October
12 days remaining
Preparing
6/8 requirements complete

---

# 11. DASHBOARD TODAY'S TASKS

Show the most important tasks due today.

Example:

Today's Tasks

□ Finalize CV
□ Request recommendation letter
□ Upload transcript
□ Complete scholarship essay

Allow completing tasks directly from the dashboard.

When a task is completed, update the database instantly.

---

# 12. TO-DO SYSTEM

The To-Do system is a major feature.

Do not implement it as a simple checklist.

Build a real but lightweight task management system specifically designed around the scholarship workflow.

The goal is:

**I should open the To-Do page and immediately understand what I need to do today, this week, and this month.**

---

# 13. TO-DO PAGE STRUCTURE

Create a dedicated To-Do page.

At the top, provide a clean segmented navigation:

Today
Upcoming
This Week
This Month
All Tasks

Potentially also:

Overdue

The user should be able to switch views without navigating to separate pages.

---

# 14. TODAY VIEW

The default To-Do view should be Today.

Display all tasks whose due date is today.

Organize them in a clean list.

Each task should show:

* Checkbox
* Task title
* Optional description
* Due date
* Priority
* Associated scholarship
* Category
* Optional time
* Status

Example:

TODAY

□ Finish personal statement
Scholarship: Global Future Scholarship
Priority: High

□ Request recommendation letter
Scholarship: Japan Scholarship
Priority: High

□ Update CV
General
Priority: Medium

The user should be able to complete a task with one click.

Completed tasks should remain visible but become visually subdued.

---

# 15. THIS WEEK VIEW

Create a weekly task view.

Divide tasks by day.

Example:

MONDAY
□ Update CV

TUESDAY
□ Request recommendation letter

WEDNESDAY
□ IELTS registration

THURSDAY
□ Review scholarship requirements

FRIDAY
□ Finalize essay

SATURDAY
No tasks

SUNDAY
□ Weekly scholarship review

At the top display:

This Week
11 tasks
7 completed
4 remaining

This gives the user a very simple understanding of weekly workload.

---

# 16. THIS MONTH VIEW

Create a monthly task view.

Tasks should be grouped by date.

Example:

SEPTEMBER

23
□ Update CV
□ Review scholarship A

25
□ Request recommendation letter

29
□ Complete personal statement

OCTOBER

02
□ Submit application

The exact visual presentation can be a calendar-like list rather than a large calendar.

Prioritize usability over complexity.

---

# 17. UPCOMING TASKS

Create an Upcoming view showing future tasks.

Group by:

* Tomorrow
* Later this week
* Next week
* Later this month
* Future

This view should help the user plan ahead.

---

# 18. OVERDUE TASKS

Create an Overdue filter.

An overdue task is any incomplete task whose due date has passed.

Example:

OVERDUE

! Finalize recommendation letter
Due 20 September
3 days overdue

! Upload financial document
Due 21 September
2 days overdue

Make overdue status visually noticeable but not alarming.

Allow the user to:

* Complete the task
* Change the due date
* Edit the task
* Delete the task

---

# 19. TASK CREATION

Create a fast "Add Task" interaction.

The user should be able to add a task from:

* Dashboard
* To-Do page
* Scholarship detail page

The quick-create form should contain:

### Required

Task title

### Optional

* Description
* Due date
* Time
* Priority
* Scholarship
* Document
* Activity
* Category
* Notes

Task priorities:

* Low
* Medium
* High

Do not use arbitrary numerical priority scores.

---

# 20. TASK CATEGORIES

Create practical categories.

Suggested categories:

* Scholarship
* Documents
* Essay
* Recommendation
* Test
* Research
* University
* Finance
* Personal
* General

Allow custom categories later, but keep the initial system simple.

---

# 21. TASK RELATIONSHIPS

This is extremely important.

Tasks should be linkable to other entities.

For example:

Task:
"Request recommendation letter"

Linked Scholarship:
Japan Government Scholarship

Linked Document:
Recommendation Letter

Another example:

Task:
"Upload passport"

Linked Scholarship:
Global Future Scholarship

Linked Document:
Passport

Another:

Task:
"Add volunteering experience to application"

Linked Scholarship:
University Scholarship

Linked Activity:
Volunteer Coordinator

This creates an interconnected system.

---

# 22. TASK CREATION FROM SCHOLARSHIP REQUIREMENTS

When viewing a scholarship requirement, allow:

"Create Task"

For example:

Requirement:
Recommendation Letter

Button:
Create Task

Automatically create:

"Obtain Recommendation Letter"

and automatically link it to:

* Scholarship
* Requirement
* Document if applicable

This should reduce repetitive data entry.

---

# 23. TASK COMPLETION

When a task is marked complete:

* Save completion timestamp
* Save completed_by/user
* Update UI immediately
* Move completed task visually below incomplete tasks where appropriate

Do not delete completed tasks.

Maintain task history.

Allow reopening a completed task.

---

# 24. TASK DATE MANAGEMENT

Allow the user to easily move tasks:

Today
Tomorrow
This Week
Next Week
Custom Date

Use quick controls.

For example:

[Today] [Tomorrow] [Next Week] [Pick Date]

This should make task rescheduling extremely fast.

---

# 25. SMART TASK CREATION

When creating a scholarship, optionally allow the system to suggest common tasks.

For example, after creating a scholarship:

Suggested tasks:

□ Read scholarship requirements
□ Check eligibility
□ Prepare documents
□ Prepare recommendation letter
□ Prepare CV
□ Write personal statement
□ Review application
□ Submit application

Do not automatically create all tasks without user control.

Instead provide:

"Add suggested tasks"

---

# 26. SCHOLARSHIPS SECTION

Create a Scholarships page.

Features:

* Search
* Filter
* Sort
* Add Scholarship
* Edit
* Delete/archive
* View details

Statuses:

* Researching
* Preparing
* Ready to Apply
* Applied
* Interview
* Waiting
* Accepted
* Rejected
* Withdrawn

Allow status changes quickly.

---

# 27. SCHOLARSHIP FIELDS

Each scholarship should contain:

## Basic

* Scholarship name
* University
* Organization
* Country
* Degree level
* Field of study
* Intake
* Academic year
* Funding type

## Links

* Scholarship website
* Application portal
* Information page
* Other relevant URLs

## Deadline

* Application deadline
* Optional early deadline
* Optional notification date
* Submission date

## Management

* Status
* Priority
* Notes
* Tags

---

# 28. SCHOLARSHIP REQUIREMENTS

Allow users to create individual requirements.

Fields:

* Requirement name
* Requirement type
* Status
* Due date
* Notes
* Linked document
* Linked activity
* Related task

Requirement types:

* Document
* Essay
* Recommendation
* Test
* Portfolio
* Financial
* Other

Statuses:

* Not Started
* In Progress
* Ready
* Submitted
* Not Required

Display:

6 of 8 requirements complete

with a visual progress bar.

---

# 29. DOCUMENT LIBRARY

Create a reusable Document Library.

A document must exist independently from scholarships.

Fields:

* Name
* Category
* Status
* Description
* Issue date
* Expiry date
* File
* Notes

Categories:

* Identity
* Academic
* Recommendation
* Financial
* Test
* CV
* Certificate
* Portfolio
* Other

Statuses:

* Need to Create
* Need to Collect
* In Progress
* Ready
* Uploaded
* Expired
* Not Available

Support secure file uploads through Supabase Storage.

Do not expose private file URLs publicly.

---

# 30. DOCUMENT-SCHOLARSHIP LINKING

Allow each document to connect to multiple scholarships.

Example:

Passport

Used in:

* Scholarship A
* Scholarship B
* Scholarship C

When a document is marked "Ready", corresponding linked requirements should reflect that appropriately.

Do not automatically mark requirements as submitted unless the application logic explicitly indicates submission.

Keep "document ready" and "requirement submitted" as separate concepts.

---

# 31. DOCUMENT EXPIRATION

If a document contains an expiry date, calculate:

* Days until expiry
* Expired
* Expiring soon

Use this information in the Dashboard's Needs Attention area.

Example:

Passport
Expires 15 January 2027
114 days remaining

---

# 32. ACTIVITIES SECTION

Create a structured achievement/activity database.

Fields:

* Activity title
* Type
* Organization
* Role
* Start date
* End date
* Description
* Impact
* Achievements
* Hours per week
* Location
* URL
* Supporting evidence

Types:

* Academic
* Leadership
* Volunteering
* Work Experience
* Project
* Research
* Competition
* Award
* Extracurricular
* Community
* Other

Allow activities to be linked to scholarships.

---

# 33. PROFILE & STORY

Create a structured personal information system.

Sections:

## Personal

* Full name
* Email
* Phone
* Country
* City
* Languages

## Academic

* Educational history
* Institutions
* Programs
* Grades
* Academic achievements
* Coursework

## Goals

* Intended field
* Intended degree
* Career goals
* Long-term goals
* Why this field
* Why study abroad

## Gap Year

Create a dedicated section for:

* Why I took a gap year
* What I am doing during the gap year
* What I have learned
* Skills developed
* Projects completed
* Goals for the year

## Personal Story

Create editable sections:

* My Background
* My Challenges
* My Turning Points
* My Motivation
* My Values
* Why This Field Matters To Me
* What I Want To Contribute
* My Long-Term Vision

This is not necessarily a final essay.

It is a private source-of-truth database that the user can later reuse while writing applications.

---

# 34. GLOBAL SEARCH

Implement global search across:

* Scholarships
* Tasks
* Documents
* Activities
* Profile
* Story

Search should return grouped results.

Example:

Search:
"leadership"

Results:

Scholarships
2 results

Activities
4 results

Story
3 sections

Tasks
1 result

Clicking a result opens the relevant record.

---

# 35. GLOBAL QUICK ADD

Create a keyboard-friendly quick action system.

Possible shortcut:

Cmd/Ctrl + K

Show:

Add Scholarship
Add Task
Add Document
Add Activity

Also allow search.

This is optional but highly desirable.

---

# 36. DASHBOARD INTELLIGENCE

The dashboard should derive useful information from the database.

Examples:

### Application progress

12 active scholarships

### Upcoming

3 deadlines within 14 days

### Tasks

4 tasks due today

### Missing

7 incomplete requirements

### Documents

2 documents expiring soon

These are informational summaries.

Do not create artificial scores or rankings.

---

# 37. SCHOLARSHIP APPLICATION PIPELINE

Create a visual pipeline or status summary.

Example:

Researching       4
Preparing         3
Ready             2
Applied           5
Interview         1
Waiting           3

The counts should be clickable and filter the Scholarships page.

---

# 38. CALENDAR LOGIC

Use proper date handling.

Store dates in PostgreSQL using appropriate date/timestamp types.

Be careful about timezone issues.

The application should determine:

* Today
* Tomorrow
* Current week
* Current month
* Overdue
* Upcoming

using the user's local timezone where appropriate.

Do not hardcode dates.

---

# 39. DATA MODEL

Create a proper relational database.

Suggested tables:

users
profiles
profile_education
story_sections
scholarships
scholarship_requirements
documents
scholarship_documents
activities
scholarship_activities
tasks
task_links
tags
scholarship_tags
activity_tags

You may simplify this structure where appropriate, but maintain clean relationships.

Use UUID primary keys.

Every user-owned record must have a user_id.

Include:

* created_at
* updated_at

where appropriate.

Use indexes for:

* user_id
* deadline
* status
* due_date
* task completion state

---

# 40. ROW LEVEL SECURITY

Implement Supabase Row Level Security properly.

Users must only be able to:

* Read their own data
* Create their own data
* Update their own data
* Delete their own data

Do not rely only on frontend filtering for security.

---

# 41. TASK DATABASE DESIGN

Tasks should support:

* id
* user_id
* title
* description
* due_date
* due_time
* completed
* completed_at
* priority
* category
* scholarship_id nullable
* document_id nullable
* activity_id nullable
* requirement_id nullable
* created_at
* updated_at

Design the schema in a way that makes future task relationships easy to extend.

---

# 42. TASK STATES

At minimum support:

* Pending
* Completed

Do not introduce unnecessary workflow states for tasks.

Scholarship statuses and task statuses should remain separate concepts.

---

# 43. OPTIONAL RECURRING TASKS

Design the schema so recurring tasks can be supported later.

Do not make recurring tasks a complicated mandatory feature in version 1.

The architecture should be extensible.

---

# 44. TASK FILTERING

The To-Do page should support:

* Today
* Tomorrow
* This Week
* This Month
* Upcoming
* Overdue
* Completed
* All

Also allow filtering by:

* Priority
* Category
* Scholarship

---

# 45. TASK SORTING

Within a view, prioritize:

1. Incomplete tasks first
2. Higher priority
3. Earlier due date

Completed tasks can be shown below pending tasks.

Do not impose a complicated scoring algorithm.

---

# 46. TASK UX

Task management should be extremely fast.

The user should not need to open a modal every time they complete a task.

Allow:

* One-click completion
* Inline editing where practical
* Quick date changes
* Quick priority changes
* Quick scholarship assignment

Hovering or opening a task should reveal additional actions.

Mobile should have an easy "Add Task" floating or prominent action.

---

# 47. TASK DETAILS

Opening a task should show:

Task name

Description

Due date

Priority

Category

Associated scholarship

Associated document

Associated activity

Associated requirement

Created date

Completed date

Notes

Allow editing all relevant fields.

---

# 48. SMART CONNECTIONS

Build contextual links between entities.

For example:

Scholarship page:

Requirements
Documents
Tasks
Activities

Document page:

Used by scholarships
Related tasks

Activity page:

Used by scholarships
Related tasks

Task page:

Related scholarship
Related requirement
Related document
Related activity

This should feel like a connected knowledge system.

---

# 49. EMPTY STATES

Every section needs a useful empty state.

Example:

No scholarships yet.

"Start by adding a scholarship and its deadline."

Button:
Add Scholarship

For tasks:

"No tasks for today."

"You're clear for today."

This should feel encouraging but not childish.

---

# 50. LOADING STATES

Every asynchronous page/action must have useful loading states.

Use skeleton loaders where appropriate.

Do not show blank screens while data loads.

---

# 51. ERROR HANDLING

Implement proper:

* Form validation
* API error handling
* Database error handling
* File upload error handling
* Empty states
* Retry states

Never silently fail.

Show concise, understandable error messages.

---

# 52. CONFIRMATION AND DESTRUCTIVE ACTIONS

For destructive actions such as deleting scholarships, documents, activities, or tasks:

Show a confirmation dialog.

Prefer archive functionality where appropriate rather than permanently deleting important application history.

---

# 53. PERFORMANCE

Keep the application fast.

Avoid unnecessary database requests.

Use appropriate server/client components in Next.js.

Do not load every file/document unnecessarily.

Paginate or progressively load large datasets where appropriate.

Keep the dashboard lightweight.

---

# 54. ACCESSIBILITY

Use semantic HTML and accessible shadcn components.

Ensure:

* Keyboard navigation
* Proper focus states
* Screen-reader-friendly labels
* Accessible dialogs
* Accessible dropdowns
* Sufficient contrast
* Proper form labels

---

# 55. SECURITY

Do not expose Supabase service role keys to the client.

Use environment variables correctly.

Use Supabase authenticated access for private storage.

Validate user-owned IDs on the backend/server side.

Never assume that frontend restrictions provide security.

---

# 56. SEED DATA

Create optional development seed data using fictional scholarships.

Example:

Global Future Scholarship
International Excellence Award
Global Leadership Scholarship

Do not use real scholarship deadlines in seed data.

Create enough sample data to demonstrate:

* Timeline
* Tasks
* Documents
* Activities
* Requirements
* Dashboard statistics

---

# 57. ONBOARDING

On the first login, show a lightweight onboarding experience.

Do not force the user through a long wizard.

Show:

Welcome to Scholarship OS

Complete these basics:

1. Add your first scholarship
2. Add important documents
3. Add your activities
4. Complete your profile
5. Create your first task

Allow skipping.

---

# 58. FIRST-TIME DASHBOARD

When no data exists, the dashboard should still look intentional.

Do not show empty cards with zeros everywhere.

Instead show:

Start building your scholarship pipeline.

Then show a few clear actions.

---

# 59. DATE AND DEADLINE UX

Always make deadlines easy to understand.

Use both:

Absolute date:
18 October 2026

Relative information:
12 days remaining

For past deadlines:

Deadline passed
5 days ago

Do not rely only on relative dates.

---

# 60. TODAY / WEEK / MONTH LOGIC

This is a critical part of the task system.

Implement robust date filtering.

## Today

A task belongs to Today when its due date equals the user's current local calendar date.

## This Week

A task belongs to This Week when its due date falls within the current calendar week.

Define a consistent week start, preferably Monday.

## This Month

A task belongs to This Month when its due date falls within the current calendar month.

## Upcoming

Incomplete tasks with a due date after today.

## Overdue

Incomplete tasks where the due date is before today.

Make these calculations consistent everywhere in the application.

---

# 61. TASK COUNTS

Display task counts dynamically.

Example:

Today
4

This Week
11

This Month
23

Overdue
2

Do not count completed tasks in the active workload counts unless explicitly displaying completion statistics.

---

# 62. COMPLETION METRICS

The Dashboard can show lightweight progress:

Today
3 of 5 completed

This Week
8 of 12 completed

Keep this informational.

Do not create gamification unless explicitly requested later.

---

# 63. SCHOLARSHIP TO-DO AUTOMATION

When a scholarship requirement is added, optionally provide:

"Create related task"

For example:

Requirement:
IELTS Score

Task:
Register for IELTS

Requirement:
Recommendation Letter

Task:
Ask professor for recommendation

Requirement:
Personal Statement

Task:
Draft personal statement

This should save the user time.

---

# 64. APPLICATION SUBMISSION WORKFLOW

When a scholarship is marked:

"Ready to Apply"

the user should see a final checklist.

Example:

Final Application Check

✓ Passport
✓ Transcript
✓ CV
✓ Recommendation Letter
✓ Personal Statement
✓ Test Score

Then:

Submit Application

After submission, allow the user to change the scholarship status to:

Applied

and record:

Submitted on:
[date]

---

# 65. INTERVIEW WORKFLOW

If scholarship status becomes:

Interview

show an optional interview preparation area.

Allow adding tasks such as:

□ Research university
□ Research scholarship
□ Prepare common answers
□ Review personal statement
□ Prepare questions
□ Conduct mock interview

Keep this lightweight.

---

# 66. WAITING WORKFLOW

When status is:

Waiting

show:

Application submitted:
Date

Expected response:
Optional date

Tasks:

□ Check application portal
□ Follow up
□ Check email

Do not automatically create reminders without user control.

---

# 67. STORY DATABASE FUTURE EXTENSIBILITY

The Profile & Story system should be built so it can later support:

* Essay bank
* Personal statement drafts
* Short-answer database
* Why this university?
* Why this country?
* Leadership examples
* Challenge examples
* Failure examples
* Impact examples

Do not build the complete essay system unless necessary for the first version.

Build clean foundations.

---

# 68. UI COMPONENTS

Create reusable components such as:

* AppShell
* Sidebar
* MobileNavigation
* DashboardHeader
* DeadlineTimeline
* ScholarshipCard
* ScholarshipStatusBadge
* RequirementList
* ProgressBar
* TaskList
* TaskItem
* TaskQuickAdd
* DatePicker
* PriorityBadge
* DocumentCard
* ActivityCard
* EmptyState
* SearchInput
* FilterDropdown
* ConfirmationDialog

Avoid duplicated UI code.

---

# 69. FORMS

Use robust form handling.

Prefer:

React Hook Form
+
Zod validation

where appropriate.

Forms should have:

* Clear labels
* Helpful placeholders
* Validation
* Loading states
* Error messages
* Success feedback

---

# 70. DATABASE OPERATIONS

Create clean data-access abstractions.

Do not place large amounts of database logic directly inside UI components.

Keep code organized into appropriate:

* components
* lib
* server/data functions
* hooks
* types
* validation schemas

---

# 71. RESPONSIVE TIMELINE REQUIREMENT

The scholarship timeline is a distinctive feature.

Do not replace it with a generic calendar component.

It should clearly communicate:

time → deadline → scholarship

On mobile, provide a practical alternative such as:

date-based vertical timeline

while preserving the visual timeline concept.

Desktop:
Horizontal timeline

Mobile:
Vertical timeline or horizontally scrollable timeline

Use whichever provides the best usability.

---

# 72. VISUAL STATUS SYSTEM

Use subtle visual distinctions for scholarship states.

Examples:

Researching
Preparing
Ready to Apply
Applied
Interview
Waiting
Accepted
Rejected

Do not make the entire interface overly colorful.

Use badges and small indicators.

---

# 73. INFORMATION HIERARCHY

When showing scholarship information, prioritize:

1. Scholarship name
2. Deadline
3. Days remaining
4. Status
5. Progress
6. Requirements
7. Other metadata

The deadline should never be buried.

---

# 74. GLOBAL QUICK ADD

Create a global floating "+" or command action.

Actions:

* Scholarship
* Task
* Document
* Activity

The user should be able to create records from anywhere.

---

# 75. KEYBOARD SHORTCUTS

Where practical support:

Cmd/Ctrl + K
Global command/search

N
New task, when on To-Do page

Do not make keyboard shortcuts mandatory.

---

# 76. DATA PERSISTENCE

After any creation or update:

* Save to Supabase
* Update interface immediately
* Handle errors gracefully

Refreshing the browser must not lose data.

Logging in from another device must show the same data.

---

# 77. VERCEL DEPLOYMENT

Make the application deployment-ready for Vercel.

Use environment variables:

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

Never expose private server credentials.

Provide a README explaining:

1. Install dependencies
2. Create Supabase project
3. Run database schema/migrations
4. Configure storage
5. Configure authentication
6. Add environment variables
7. Run locally
8. Deploy to Vercel

---

# 78. README

Create a complete README containing:

* Product overview
* Tech stack
* Project structure
* Environment variables
* Supabase setup
* Database setup
* Storage setup
* Authentication setup
* Local development
* Production deployment
* Vercel configuration
* Troubleshooting

---

# 79. TEST THE COMPLETE USER JOURNEY

Before considering the application complete, test this exact workflow:

## Scholarship

1. Log in
2. Add scholarship
3. Add deadline
4. Set status
5. Add requirements
6. Add notes
7. Verify scholarship appears on timeline

## Documents

8. Add passport
9. Add transcript
10. Add recommendation letter
11. Upload a document
12. Set document status
13. Link document to scholarship requirement

## Activities

14. Add leadership activity
15. Add volunteer activity
16. Link activity to scholarship

## Tasks

17. Create task from dashboard
18. Create task from scholarship
19. Assign task to today
20. Assign task to this week
21. Assign task to a future date
22. Mark task completed
23. Reopen completed task
24. Reschedule task
25. Verify overdue task detection

## Dashboard

26. Verify Today task count
27. Verify This Week task count
28. Verify This Month task count
29. Verify overdue count
30. Verify scholarship deadline timeline
31. Verify requirement progress
32. Verify Needs Attention section

## Persistence

33. Refresh browser
34. Log out
35. Log back in
36. Verify everything persists

---

# 80. IMPORTANT DEVELOPMENT RULE

Do not stop after creating a visual interface.

The final result must be a working application.

Do not use fake local state as the main data source.

Do not hardcode demo values into the production UI.

Do not implement fake buttons.

Do not create UI elements that do nothing.

Everything visible to the user should either work or clearly be marked as a future placeholder.

---

# 81. IMPLEMENTATION ORDER

Build in this order:

### Phase 1

Project architecture
Supabase setup
Database schema
Authentication
Application shell

### Phase 2

Dashboard
Timeline
Scholarship CRUD

### Phase 3

Requirements
Documents
Document linking

### Phase 4

Activities
Activity linking

### Phase 5

To-Do system
Today
This Week
This Month
Upcoming
Overdue
Task relationships
Task quick actions

### Phase 6

Profile & Story

### Phase 7

Global search
Quick actions
Polishing
Responsive improvements
Accessibility
Error handling

### Phase 8

Testing
Bug fixing
Deployment preparation
README

---

# 82. FINAL PRODUCT STANDARD

The final application should feel like a tool the user can genuinely use every day during a scholarship application year.

When the user opens the application in the morning, they should immediately see:

**What is due today?**

**What deadlines are approaching?**

**What applications need attention?**

**What documents are missing?**

**What should I work on next?**

The user should never have to remember everything mentally.

The system should hold the operational details.

Keep the product focused.

Do not over-engineer it.

Do not add unnecessary SaaS features.

Do not add team collaboration.

Do not add billing.

Do not add social features.

Do not add unnecessary AI features.

Build a beautiful, fast, private scholarship management system that feels like a personal operating system for the user's gap year and scholarship applications.

The application should be production-ready and deployable on Vercel.
and WE will be using Firebase for Storage so that the data remain consistent accross devices  

**the above point is very imporntant**
