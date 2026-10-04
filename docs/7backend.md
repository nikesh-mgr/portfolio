# Portfolio Frontend — Backend Integration & UI/UX Specification

> **Purpose:** Complete frontend-development handoff for the personal developer portfolio.
>
> **Backend is the single source of truth.**
>
> The frontend must follow the existing backend API routes, response structures, authentication flow, models, validation behavior, upload behavior, and business logic.
>
> Do **not** change backend behavior, API contracts, database models, routes, authentication, or established frontend architecture unless explicitly approved.

---

# TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Frontend Architecture](#2-frontend-architecture)
3. [API Configuration](#3-api-configuration)
4. [Authentication](#4-authentication)
5. [Global API Behavior](#5-global-api-behavior)
6. [Global UI/UX Requirements](#6-global-uiux-requirements)
7. [Public Portfolio Structure](#7-public-portfolio-structure)
8. [Admin Dashboard Structure](#8-admin-dashboard-structure)
9. [Projects](#9-projects)
10. [Certificates](#10-certificates)
11. [Experience](#11-experience)
12. [Education](#12-education)
13. [Skills](#13-skills)
14. [Resume](#14-resume)
15. [Site Settings](#15-site-settings)
16. [Profile Image](#16-profile-image)
17. [Contact](#17-contact)
18. [Uploads](#18-uploads)
19. [Error Handling](#19-error-handling)
20. [Form Validation](#20-form-validation)
21. [Loading and Empty States](#21-loading-and-empty-states)
22. [Toast Messaging](#22-toast-messaging)
23. [Accessibility](#23-accessibility)
24. [Responsive Design](#24-responsive-design)
25. [Motion and Animation](#25-motion-and-animation)
26. [Security Rules](#26-security-rules)
27. [React Query Strategy](#27-react-query-strategy)
28. [Component Architecture](#28-component-architecture)
29. [API Module Architecture](#29-api-module-architecture)
30. [Cache Invalidation](#30-cache-invalidation)
31. [Important Backend Contract Issues](#31-important-backend-contract-issues)
32. [Frontend Implementation Rules](#32-frontend-implementation-rules)
33. [Final Frontend Quality Checklist](#33-final-frontend-quality-checklist)

---

# 1. PROJECT OVERVIEW

## Purpose

Build a professional personal developer portfolio for:

- Recruiters
- Hiring managers
- Internship opportunities
- Freelance/client inquiries
- Technical visitors
- Developers reviewing projects

The website should communicate:

- Professionalism
- Technical ability
- Real project experience
- Reliability
- Strong visual presentation
- Accessibility
- Fast interaction
- High-quality UX

---

# 2. FRONTEND ARCHITECTURE

## Current Frontend Stack

Use the existing frontend stack:

- React
- Vite
- JavaScript
- JSX
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React
- React Icons
- Axios
- React Hook Form
- Zod
- TanStack React Query
- Sonner

---

## Coding Conventions

Use:

- JavaScript / JSX
- Named arrow-function components
- camelCase
- Reusable components
- Small focused components
- Feature-based organization where appropriate
- React Query for server state
- React Hook Form for forms
- Zod for client-side validation
- Semantic HTML
- Mobile-first CSS

---

## Avoid

Do not introduce unnecessary:

- TypeScript
- Redux
- Duplicate state-management systems
- API calls directly inside every component
- Hardcoded backend URLs
- localStorage JWT handling
- Authorization headers
- Inline SVG brand icons
- Large monolithic components
- Duplicate UI components
- Unnecessary dependencies

---

# 3. API CONFIGURATION

## Development API

```text
http://localhost:5000/api
Environment Variable
VITE_API_URL=http://localhost:5000/api
Axios Instance

The frontend should have one centralized Axios instance:

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default api;
Important

Every authenticated request must use:

withCredentials: true

The backend authentication cookie is:

accessToken

The frontend must NOT manually manage this token.

4. AUTHENTICATION
Authentication Architecture

Authentication uses:

JWT
+
HTTP-only cookie

Cookie:

accessToken

Frontend does not have access to the HTTP-only cookie through JavaScript.

Never Use

Do not implement:

localStorage.setItem("token", ...)

Do not implement:

sessionStorage.setItem("token", ...)

Do not implement:

Authorization: Bearer <token>

The browser automatically sends the authentication cookie.

5. AUTH API
Login
POST /auth/login
Current Admin
GET /auth/me
Logout
POST /auth/logout
Admin Creation
POST /auth/create-admin

This should generally be treated as an administrative/setup operation rather than a public portfolio feature.

6. AUTHENTICATION UX
Application Startup

Recommended flow:

Application loads
        ↓
Check authentication state
        ↓
GET /auth/me
        ↓
Authenticated?
   ┌────┴────┐
   │         │
  Yes        No
   │         │
Admin UI    Login

Do not display protected dashboard content before authentication status is known.

Login Form

Fields:

Email
Password

States:

Idle
Submitting
Success
Error

Button:

Sign In

During request:

Signing in...

Prevent duplicate submissions.

Successful Login

After login:

Backend sets accessToken
Frontend does not store token
Refresh/auth state
Navigate to dashboard
Show optional success toast

Example:

Welcome back.
Unauthorized Request

When an admin API returns:

401

Frontend should:

Treat session as invalid/expired
Clear relevant auth state
Redirect to login
Avoid infinite redirect loops
Show a clear message

Example:

Your session has expired. Please sign in again.
Logout

Call:

POST /auth/logout

Then:

Clear authentication state
Clear private React Query cache
Redirect to login
Prevent access to admin pages
7. GLOBAL API RESPONSE STRUCTURE

Backend responses are not completely uniform.

Some endpoints return:

{
  "success": true,
  "data": {}
}

Others:

{
  "success": true,
  "project": {}
}

Others:

{
  "success": true,
  "count": 5,
  "projects": []
}

Therefore:

Each API module must understand the exact response structure of its endpoint.

Do not create a global assumption that every response uses:

response.data.data
8. GLOBAL UI/UX REQUIREMENTS

Every API-driven feature should support:

Loading
Success
Error
Empty
Retry
Disabled
Deleting
Uploading
Saving
9. LOADING STATES

Use:

Skeletons
Spinners where appropriate
Disabled buttons
Upload progress
Saving indicators

Avoid blank screens.

10. SUCCESS STATES

After successful mutation:

Show toast
Update UI
Invalidate/refetch relevant queries
Close modal/sheet when appropriate
Reset form when appropriate

Examples:

Project created successfully.
Project updated successfully.
Project deleted successfully.
Certificate created successfully.
Certificate updated successfully.
Message sent successfully.
Profile image updated successfully.
11. ERROR STATES

Never expose internal errors such as:

Stack traces
MongoDB errors
Cloudinary errors
Internal file paths
JWT internals
Database implementation details

Prefer:

Something went wrong. Please try again.

Or use the backend's safe message.

12. EMPTY STATES

Every list must have a useful empty state.

Example public:

No projects available yet.

Example admin:

No projects found.

Create your first project to get started.

Empty states should include an appropriate action when useful.

13. GLOBAL ADMIN DASHBOARD

Recommended navigation:

Dashboard
Projects
Certificates
Experience
Education
Skills
Resume
Contacts
Site Settings
Profile
Logout
Dashboard

Can show:

Projects
Certificates
Experience
Education
Skills
Unread Messages
Active Resume

The dashboard should use existing API data rather than duplicating data-management logic.

14. ADMIN NAVIGATION

Desktop:

┌──────────────┬─────────────────────────────┐
│ Sidebar      │ Main Content                │
│              │                             │
│ Dashboard    │ Page                        │
│ Projects     │                             │
│ Certificates │                             │
│ Experience   │                             │
│ Education    │                             │
│ Skills       │                             │
│ Resume       │                             │
│ Contacts     │                             │
│ Settings     │                             │
└──────────────┴─────────────────────────────┘

Mobile:

Header
  ↓
Menu button
  ↓
Sheet / Drawer

Use shadcn Sheet appropriately.

Do not use unnecessary asChild patterns.

15. PROJECTS

Projects are a primary portfolio feature.

Public Project APIs
All projects
GET /projects

Response:

{
  "success": true,
  "count": 5,
  "projects": []
}
Featured projects
GET /projects/featured

Response:

{
  "success": true,
  "count": 3,
  "projects": []
}
Project by slug
GET /projects/slug/:slug

Response:

{
  "success": true,
  "project": {}
}
Project by ID
GET /projects/:id

Response:

{
  "success": true,
  "project": {}
}
16. ADMIN PROJECT APIs
All projects
GET /projects/admin/all

Authentication required.

Create project
POST /projects

Authentication required.

Content type:

multipart/form-data

Primary image field:

image
Update project
PATCH /projects/:id

Authentication required.

Content type:

multipart/form-data

Primary image field:

image

The image is optional during updates.

Delete project
DELETE /projects/:id

Authentication required.

17. PROJECT GALLERY
Add gallery images
POST /projects/:id/images

Authentication required.

Multipart field:

images

Maximum:

10 gallery images
Delete gallery image
DELETE /projects/:id/images

Authentication required.

Body:

{
  "publicId": "cloudinary/public/id"
}
18. PROJECT DATA MODEL

Frontend can expect:

{
  _id,
  title,
  slug,
  shortDescription,
  description,

  technologies: [],

  category,

  image: {
    url,
    publicId
  },

  images: [
    {
      url,
      publicId
    }
  ],

  githubUrl,
  liveUrl,

  featured,

  status,

  order,

  createdAt,
  updatedAt
}
19. PROJECT STATUS

Allowed values:

completed
in-progress
planned

Recommended visual labels:

Completed
In Progress
Planned

Do not invent additional statuses.

20. PROJECT PUBLIC UI

Recommended card:

┌─────────────────────────────┐
│ Project Image               │
├─────────────────────────────┤
│ Featured                    │
│ Category                    │
│                             │
│ Project Title               │
│ Short description           │
│                             │
│ React • Node • MongoDB      │
│                             │
│ GitHub     Live Demo        │
└─────────────────────────────┘

Support:

Image loading
Image fallback
Hover state
Keyboard focus
Accessible links
Technology overflow handling
Featured indicator
21. PROJECT DETAIL UI

Recommended structure:

Project Hero
    ↓
Title
Short Description
Category
Status
Technology Stack
GitHub / Live Demo
    ↓
Primary Image
    ↓
Description
    ↓
Gallery
    ↓
Technologies
22. PROJECT GALLERY UI

Recommended features:

Thumbnail previews
Main image
Keyboard navigation
Accessible lightbox/dialog
Previous/next buttons
Image loading
Broken-image fallback

Do not rely only on hover interactions.

23. PROJECT ADMIN FORM

Fields:

title
shortDescription
description
technologies
category
githubUrl
liveUrl
featured
status
order
image
Project Form UX

Include:

Image preview
Replace image
Remove image
Technology input
URL validation
Character counters
Featured toggle
Status select
Order input
24. PROJECT EDIT BEHAVIOR

Existing project:

Existing image
Existing fields

When editing:

Existing image remains
User can optionally replace image
Text-only update must not require image upload
25. PROJECT GALLERY UX

Show:

Gallery: 4 / 10

Disable adding images when maximum is reached.

Delete image:

Remove this image?

This action cannot be undone.

[Cancel] [Remove]
26. IMPORTANT PROJECT RULE

There is currently NO:

published

field in the Project model.

Do not use:

published=true

Do not use:

publishedOnly=true

Current public API is:

GET /projects

The backend currently returns projects without a published filter.

27. CERTIFICATES
Public APIs
GET /certificates
GET /certificates/:id

Public endpoints return only:

isVisible === true
Admin APIs
GET /certificates/admin
GET /certificates/admin/:id

POST /certificates
PATCH /certificates/:id

POST /certificates/:id/image
DELETE /certificates/:id/image

DELETE /certificates/:id

Admin operations require authentication.

28. CERTIFICATE DATA
{
  _id,
  title,
  issuer,
  issueDate,

  credentialId,
  credentialUrl,

  image: {
    url,
    publicId,
    width,
    height,
    format
  },

  description,

  order,
  isVisible,

  createdAt,
  updatedAt
}
29. CERTIFICATE CREATE
POST /certificates

Authentication required.

Content type:

multipart/form-data

Image:

image

Fields:

title
issuer
issueDate
credentialId
credentialUrl
description
order
isVisible
30. CERTIFICATE UPDATE
PATCH /certificates/:id

Authentication required.

Partial update is supported.

31. CERTIFICATE IMAGE

Upload/replace:

POST /certificates/:id/image

Multipart:

image

Delete:

DELETE /certificates/:id/image
32. CERTIFICATE PUBLIC UI

Recommended card:

Certificate Image
Title
Issuer
Issue Date
Credential ID
View Credential

If no:

credentialUrl

do not render the credential button.

If no image exists, show a consistent placeholder.

33. CERTIFICATE VISIBILITY

Admin UI:

Visible
Hidden

Use:

Switch
Badge
Status indicator

Do not rely on color alone.

34. EXPERIENCE
Public APIs
GET /experiences
GET /experiences/:id
Admin APIs
POST /experiences
PATCH /experiences/:id
DELETE /experiences/:id

Authentication required for admin operations.

35. EXPERIENCE DATA
{
  _id,

  company,
  position,
  location,
  employmentType,

  startDate,
  endDate,
  current,

  description,
  responsibilities: [],
  technologies: [],

  companyUrl,

  companyLogo: {
    url,
    publicId
  },

  featured,
  order,

  createdAt,
  updatedAt
}
36. EXPERIENCE EMPLOYMENT TYPES

Allowed values:

full-time
part-time
internship
freelance
contract
self-employed

Do not invent additional values.

37. EXPERIENCE PUBLIC UI

Recommended timeline:

Company Logo

Position
Company
Employment Type
Location

Jan 2025 — Present

Description

Responsibilities
• ...
• ...

Technologies
React • Node.js • MongoDB
38. EXPERIENCE CURRENT BEHAVIOR

If:

current === true

backend ensures:

endDate = null

Frontend should therefore:

Display Present
Disable/hide end date
Show current-position state
39. EXPERIENCE ADMIN FORM

Multipart field:

companyLogo

Fields:

company
position
location
employmentType
startDate
endDate
current
description
responsibilities
technologies
companyUrl
featured
order
40. EDUCATION
Public APIs
GET /educations
GET /educations/:id
Admin APIs
POST /educations
PATCH /educations/:id
DELETE /educations/:id

Admin mutations require authentication.

41. EDUCATION UI

Recommended timeline/card:

Institution
Degree
Start Date
End Date / Present
Description

If current:

Present
42. EDUCATION ADMIN UX

Support:

Create
Edit
Delete
Current toggle
Date selection
Order control
Validation
Loading state
Error state
Success toast

The exact Education fields should follow the Education model and validators supplied by the backend.

43. SKILLS
Public APIs
GET /skills
GET /skills/:id

Optional category:

GET /skills?category=frontend
Admin APIs
POST /skills
PATCH /skills/:id
DELETE /skills/:id

Authentication required.

44. SKILL DATA
{
  _id,

  name,
  category,
  proficiency,

  icon,
  description,

  featured,
  order,
  isActive,

  createdAt,
  updatedAt
}
45. SKILL CATEGORIES

Allowed:

frontend
backend
database
devops
tools
other
46. SKILL PROFICIENCY

Range:

0 - 100

Admin UI may use:

Number input
Slider
Numeric field

Do not allow values outside the backend range.

47. SKILLS PUBLIC UI

Possible grouping:

Frontend
├── React
├── JavaScript
├── Tailwind

Backend
├── Node.js
├── Express

Database
├── MongoDB
48. SKILL ADMIN UI

Fields:

name
category
proficiency
icon
description
featured
order
isActive

Recommended controls:

Category → Select
Proficiency → Slider/Input
Featured → Switch
Active → Switch
Order → Number input
49. IMPORTANT SKILL BEHAVIOR

The skill service supports:

activeOnly = false

but the current public controller behavior returns all skills.

Therefore the frontend must not assume:

isActive === false

will automatically be filtered from public API results.

Do not silently change this behavior in the frontend or backend.

50. RESUME
Public API
GET /resume

Response:

{
  "success": true,
  "resume": {}
}
51. RESUME DATA
{
  _id,

  title,

  file: {
    url,
    publicId,
    format: "pdf",
    size
  },

  isActive,

  createdAt,
  updatedAt
}
52. PUBLIC RESUME UI

Primary actions:

View Resume
Download Resume

Use:

resume.file.url

Do not use:

siteSettings.resumeUrl

Resume is a separate backend resource.

53. ADMIN RESUME UPLOAD

Endpoint:

POST /resume

Multipart field:

resume

Additional:

title

Expected file:

PDF
54. RESUME UPDATE
PATCH /resume/:id

Authentication required.

Fields:

title
isActive
55. RESUME DELETE
DELETE /resume/:id

Authentication required.

56. RESUME ACTIVE BEHAVIOR

When a new resume is created:

New resume → Active
All previous active resumes → Inactive

Therefore admin UI should clearly display:

Active
Inactive
57. SITE SETTINGS
Public
GET /site-settings
Admin
POST /site-settings
PATCH /site-settings
DELETE /site-settings

Authentication required.

58. SITE SETTINGS DATA
{
  _id,

  siteName,
  developerName,
  tagline,
  bio,

  profileImage: {
    url,
    publicId
  },

  contactEmail,
  location,

  socialLinks: {
    github,
    linkedin,
    twitter,
    facebook,
    instagram
  },

  seo: {
    metaTitle,
    metaDescription,
    keywords,
    ogImage
  },

  isMaintenanceMode,

  createdAt,
  updatedAt
}
59. SITE SETTINGS UI

Recommended sections:

General
Social Links
SEO
Advanced
60. GENERAL SETTINGS

Fields:

Site Name
Developer Name
Tagline
Bio
Contact Email
Location

Do NOT expose:

resumeUrl
61. SOCIAL SETTINGS

Fields:

GitHub
LinkedIn
Twitter
Facebook
Instagram

Use React Icons for brand icons.

Do not use manually written inline SVG brand icons.

62. SEO SETTINGS

Expose:

Meta Title
Meta Description
Keywords

Do NOT expose:

seo.ogImage

The backend may contain ogImage, but the current frontend settings UI should not expose it.

Do not change the backend simply to hide this UI field.

63. ADVANCED SETTINGS

Current setting:

isMaintenanceMode

Use a clear switch:

Maintenance Mode

Add an explanatory description.

Example:

Temporarily disable normal public site access while performing maintenance.
64. PROFILE IMAGE

Dedicated APIs:

POST /site-settings/profile-image
PATCH /site-settings/profile-image
DELETE /site-settings/profile-image

All require authentication.

Multipart field:

profileImage
65. PROFILE IMAGE BEHAVIOR

POST:

Used when no profile image exists.

PATCH:

Used when profile image already exists.

DELETE:

Removes current profile image.
66. PROFILE IMAGE UI

No image:

Upload Profile Image

Existing image:

Current Profile Image

[Replace Image]
[Remove Image]

Show preview before upload where practical.

67. PROFILE IMAGE DELETE UX

Use confirmation:

Remove profile image?

This will remove the current profile image from your portfolio.

[Cancel] [Remove]
68. CONTACT
Public API
POST /contact

No authentication.

69. CONTACT REQUEST
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project inquiry",
  "message": "Hello..."
}
70. CONTACT RESPONSE

Successful response:

{
  "success": true,
  "message": "Message sent successfully",
  "contact": {
    "id": "...",
    "name": "...",
    "subject": "...",
    "createdAt": "..."
  }
}
71. CONTACT FORM UX

Fields:

Name
Email
Subject
Message

Use:

React Hook Form
Zod
Inline validation
Character count
Submit loading state
Success toast
Error toast

Button:

Send Message

Loading:

Sending...

Prevent duplicate submission.

72. CONTACT SUCCESS FLOW

After successful submission:

Show success toast
Reset form
Keep user on the current page
Restore appropriate focus
Do not unnecessarily redirect

Message:

Message sent successfully.
73. CONTACT ADMIN APIs
GET /contact
GET /contact/:id

PATCH /contact/:id/status
PATCH /contact/:id/read

DELETE /contact/:id

All require authentication.

74. CONTACT ADMIN DATA
{
  _id,

  name,
  email,
  subject,
  message,

  status,
  isRead,
  repliedAt,

  createdAt,
  updatedAt
}
75. CONTACT ADMIN UI

Recommended inbox:

┌──────────────────────────────────────┐
│ Contacts                             │
├──────────────────────────────────────┤
│ Search                               │
│ Status filter                        │
│ Read/unread filter                   │
├──────────────────────────────────────┤
│ ● John Doe                           │
│   Project inquiry                    │
│   2 hours ago                        │
├──────────────────────────────────────┤
│ ○ Jane Doe                           │
│   Collaboration                      │
│   Yesterday                          │
└──────────────────────────────────────┘
76. CONTACT DETAIL

Show:

Sender
Email
Subject
Message
Received date
Status
Read state

Actions:

Mark as Read
Change Status
Delete
77. CONTACT READ STATE

Endpoint:

PATCH /contact/:id/read

Body:

{
  "isRead": true
}

Unread state should be visually obvious without relying only on color.

Use:

Dot
Weight
Label
Icon
Accessible text
78. UPLOAD FEATURE

Current generic endpoint:

POST /upload/project-image

Authentication required.

Multipart:

image

Response:

{
  "success": true,
  "message": "Project image uploaded successfully",
  "image": {
    "url": "...",
    "publicId": "...",
    "width": 1200,
    "height": 800,
    "format": "jpg"
  }
}
79. GENERIC UPLOAD NOTE

Project create/update already support primary image uploads.

Therefore:

/upload/project-image

may be redundant depending on the final frontend architecture.

Do not remove or modify the endpoint without approval.

Prefer project-specific upload behavior when possible.

80. IMAGE UPLOAD UX

Every image uploader should support:

Idle
Selecting
Preview
Uploading
Success
Error

Example:

┌─────────────────────────────┐
│                             │
│       Upload Image          │
│                             │
│    Drag & Drop / Browse     │
│                             │
└─────────────────────────────┘

After selection:

Preview
Filename
File Size

[Replace]
[Remove]

During upload:

Uploading...
81. CLOUDINARY DATA

Frontend primarily needs:

url
publicId

Rendering:

image.url

Deletion:

image.publicId

Never manually reconstruct Cloudinary URLs.

82. API ERROR HANDLING

Centralize error message extraction.

Example:

const getApiErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    "Something went wrong. Please try again."
  );
};

Use backend messages when they are safe and user-friendly.

83. HTTP STATUS UX
400
Bad request / validation error

Show field-specific or general validation feedback.

401
Authentication required

Admin:

Your session has expired. Please sign in again.
403
You do not have permission to perform this action.
404

Show resource-specific not-found UI.

Example:

Project not found.
409

Display conflict message.

Examples:

A project with this title already exists.
This certificate already exists.
429
Too many requests. Please wait a moment and try again.
500
Something went wrong on the server.
Please try again later.
84. FORM VALIDATION

Use:

React Hook Form
+
Zod

Frontend validation should improve UX.

However:

Backend validation remains authoritative.

Frontend validation must not intentionally contradict backend rules.

85. FORM DESIGN

Every field should have:

Label
Input
Optional description/help
Validation error

Do not use placeholder text as the only label.

86. FORM STATES

Each form should support:

Idle
Dirty
Submitting
Success
Validation Error
Server Error

Submit button:

Save Changes

Submitting:

Saving...

Disable duplicate submission.

87. UNSAVED CHANGES

For large admin forms, consider warning users when:

They have unsaved changes
They attempt to navigate away
They close a modal/sheet with changes

Do not add this to tiny forms where it creates unnecessary friction.

88. DELETE UX

Never immediately delete important resources without confirmation.

Use:

Delete Project?

This action cannot be undone.

[Cancel] [Delete]

For destructive actions:

Use destructive styling
Clearly explain consequence
Disable button during deletion
Show success/error toast
89. TOAST SYSTEM

Use Sonner consistently.

Examples:

Create
Project created successfully.
Update
Project updated successfully.
Delete
Project deleted successfully.
Upload
Image uploaded successfully.
Contact
Message sent successfully.
Error
Unable to save changes.

Avoid excessive toast notifications for passive GET requests.

90. LOADING SKELETONS

Use skeletons for:

Project cards
Certificate cards
Experience timeline
Skills
Resume
Site settings
Contact lists
Admin tables

Avoid showing a spinner for every small piece of content.

91. EMPTY STATES

Examples:

Projects
No projects yet.

Admin:

No projects found.

Create your first project.
Certificates
No certificates available.
Experience
No experience records yet.
Education
No education records yet.
Contacts
No messages found.
92. RETRY UX

For failed GET requests:

Unable to load projects.

[Try Again]

The retry should refetch the appropriate React Query query.

93. ACCESSIBILITY

Target:

WCAG 2.2 AA principles
94. SEMANTIC HTML

Use:

<header>
<nav>
<main>
<section>
<article>
<footer>

Use correct heading hierarchy:

h1
 ├── h2
 │    └── h3
 └── h2

Do not skip headings simply for visual sizing.

95. ACCESSIBLE FORMS

Inputs need:

<label>

Errors should be associated with the relevant field.

Use where appropriate:

aria-invalid
aria-describedby
96. ACCESSIBLE BUTTONS

Use:

<button>

for actions.

Use:

<a>

for navigation/external links.

Do not make arbitrary:

<div onClick={...}>

into buttons.

97. KEYBOARD ACCESSIBILITY

Everything interactive must work with keyboard.

Test:

Tab
Shift + Tab
Enter
Space
Escape
Arrow keys

Especially:

Dialogs
Sheets
Dropdowns
Tabs
Image galleries
Forms
Navigation
98. FOCUS MANAGEMENT

When opening a dialog:

Focus → dialog

When closing:

Focus → trigger

When submitting a form with errors:

Focus → first invalid field
99. COLOR ACCESSIBILITY

Do not communicate information only through color.

Bad:

Red = unread
Green = read

Better:

● Unread
✓ Read

with color as additional visual support.

100. REDUCED MOTION

Respect:

prefers-reduced-motion

Users who disable animation should still receive a fully usable experience.

101. RESPONSIVE DESIGN

Minimum supported viewport widths:

320px
375px
768px
1024px
1280px
1536px+

Design mobile-first.

102. MOBILE UI

On mobile:

Sidebar → Sheet/Drawer
Tables → Cards where appropriate
Forms → One column
Dialogs → Mobile-friendly
Buttons → Touch-friendly
Images → Responsive
No unnecessary horizontal scrolling
103. DESKTOP UI

Desktop can use:

Sidebar
+
Top Header
+
Content Area

Maintain reasonable content width.

Avoid extremely wide text blocks.

104. TABLE UX

For admin tables:

Use columns such as:

Name
Status
Created
Actions

On smaller screens:

Convert to cards
Hide low-priority metadata
Use responsive overflow only when necessary
105. MOTION

Use Framer Motion for subtle interactions.

Good uses:

Page entrance
Card reveal
Modal animation
Sheet animation
Image transitions
Hover feedback
Section reveal

Avoid:

Excessive animations
Long animations
Animating every element
Motion that delays interaction
106. BRAND ICONS

Use:

React Icons

for:

GitHub
LinkedIn
Twitter/X
Facebook
Instagram
Company/technology brand icons

Use:

Lucide

for generic UI icons:

Edit
Delete
Search
Upload
Download
Menu
Close
Check
Alert
Settings

Do not manually write brand SVGs.

107. SHADCN/UI RULES

Existing project uses shadcn/ui.

Follow the current component style.

Important:

Do not use unnecessary asChild.

For Sheet/Dialog triggers, use the direct trigger component with its button props/classes when compatible with the project's shadcn Base UI/Nova setup.

108. REACT QUERY

Use TanStack React Query for server state.

Recommended structure:

Query
    ↓
API module
    ↓
Axios
    ↓
Backend

Components should not contain duplicated Axios logic.

109. QUERY KEY STRUCTURE

Use consistent keys.

Example:

["projects"]
["projects", "featured"]
["projects", projectId]
["projects", "slug", slug]

["certificates"]
["certificates", certificateId]

["experiences"]
["experiences", experienceId]

["educations"]
["educations", educationId]

["skills"]
["skills", category]

["resume"]

["siteSettings"]

["contacts"]
["contacts", contactId]

["auth", "me"]

Exact structure can follow the existing frontend implementation if already established.

110. MUTATION STRATEGY

For create/update/delete:

Mutation
    ↓
Backend
    ↓
Success
    ↓
Invalidate relevant query
    ↓
UI refreshes

Avoid manually duplicating server state unless there is a strong UX reason.

111. CACHE INVALIDATION

Examples:

Create Project

Invalidate:

projects
featured projects

if the created project's state can affect them.

Update Project

Invalidate:

projects
specific project
featured projects
slug query

when appropriate.

Delete Project

Invalidate:

projects
featured projects
Certificate Mutation

Invalidate:

certificates

and the relevant individual certificate query.

Experience Mutation

Invalidate:

experiences
Education Mutation

Invalidate:

educations
Skill Mutation

Invalidate:

skills
Resume Mutation

Invalidate:

resume
Site Settings Mutation

Invalidate:

siteSettings
Contact Mutation

Invalidate:

contacts
specific contact
112. COMPONENT ARCHITECTURE

Prefer reusable components.

Example:

components/
├── ui/
├── layout/
├── shared/
├── forms/
├── feedback/
├── upload/
└── portfolio/

Feature-specific:

features/
├── projects/
├── certificates/
├── experiences/
├── education/
├── skills/
├── resume/
├── contacts/
└── settings/
113. PROJECT COMPONENTS

Potential components:

ProjectCard
ProjectGrid
ProjectHero
ProjectGallery
ProjectTechnologyList
ProjectStatusBadge
ProjectForm
ProjectImageUploader
ProjectGalleryManager
ProjectDeleteDialog
114. CERTIFICATE COMPONENTS

Potential components:

CertificateCard
CertificateGrid
CertificateForm
CertificateImageUploader
CertificateVisibilityBadge
CertificateDeleteDialog
115. EXPERIENCE COMPONENTS

Potential components:

ExperienceTimeline
ExperienceCard
ExperienceForm
CompanyLogoUploader
EmploymentTypeBadge
116. EDUCATION COMPONENTS

Potential components:

EducationTimeline
EducationCard
EducationForm
117. SKILL COMPONENTS

Potential components:

SkillGroup
SkillCard
SkillBadge
SkillForm
SkillCategoryFilter
SkillProficiencyInput
118. RESUME COMPONENTS

Potential components:

ResumeCard
ResumeViewer
ResumeUploadForm
ResumeStatusBadge
ResumeDeleteDialog
119. CONTACT COMPONENTS

Potential components:

ContactForm
ContactList
ContactListItem
ContactDetail
ContactStatusSelect
ContactReadToggle
ContactDeleteDialog
120. SETTINGS COMPONENTS

Potential components:

SettingsLayout
GeneralSettingsForm
SocialSettingsForm
SeoSettingsForm
AdvancedSettingsForm
ProfileImageManager
121. API MODULE ARCHITECTURE

Create feature-specific API modules.

Example:

api/
├── axios.js
├── authApi.js
├── projectApi.js
├── certificateApi.js
├── experienceApi.js
├── educationApi.js
├── skillApi.js
├── resumeApi.js
├── contactApi.js
└── siteSettingsApi.js
122. API MODULE RESPONSIBILITY

API modules should contain:

HTTP method
endpoint
request payload
response extraction

Components should not construct URLs manually.

123. PROJECT API EXAMPLE STRUCTURE

Conceptually:

export const getProjects = async () => {
  const response = await api.get("/projects");

  return response.data;
};

Then React Query consumes:

useQuery({
  queryKey: ["projects"],
  queryFn: getProjects,
});

Keep API logic separate from UI logic.

124. MULTIPART FORM DATA

For file uploads:

const formData = new FormData();

formData.append("title", values.title);
formData.append("image", values.image);

Do not manually set the multipart boundary.

Axios/browser will handle it.

125. FILE UPLOAD UX

Before upload:

Validate file
↓
Preview
↓
Submit
↓
Uploading
↓
Success/Error

Do not allow accidental multiple submissions.

126. FILE REPLACEMENT

For existing image:

Existing image
       ↓
Select replacement
       ↓
Preview replacement
       ↓
Submit
       ↓
Backend updates database
       ↓
Old Cloudinary asset cleanup

Frontend should not manually delete the old Cloudinary image unless using the explicit backend delete endpoint.

127. IMAGE ERROR HANDLING

Every remote image should have a fallback.

Example behavior:

Image unavailable
↓
Fallback placeholder

Do not let broken images destroy layout.

128. EXTERNAL LINKS

For:

githubUrl
liveUrl
credentialUrl
companyUrl
socialLinks

render only when the value exists.

External links should be clearly recognizable.

For new-tab behavior where appropriate:

target="_blank"
rel="noopener noreferrer"
129. URL VALIDATION

Backend expects HTTP/HTTPS URLs for applicable fields.

Frontend should validate:

http://...
https://...

Do not allow unsupported protocols such as:

javascript:
data:

for normal external URL fields.

130. DATE HANDLING

Backend returns dates as serialized timestamps/ISO-compatible values.

Frontend should:

Parse safely
Format consistently
Avoid locale-dependent ambiguity
Display human-friendly dates

Examples:

September 2026
Jan 2025 — Present
2024

Do not mutate backend date values before submission unnecessarily.

131. ORDERING

Several resources have:

order

Frontend admin can expose order controls.

Backend sorting should remain authoritative.

Typical UI:

Order
[ 1 ]

or drag-and-drop only if the existing architecture supports it.

Do not assume drag-and-drop automatically persists ordering unless an API exists for it.

132. PROJECT SORTING

Backend project sorting:

featured DESC
order ASC
createdAt DESC

Featured projects therefore naturally appear before non-featured projects.

Frontend should not override this ordering unless there is a specific presentation requirement.

133. CERTIFICATE SORTING

Backend:

order ASC
issueDate DESC
createdAt DESC

Frontend should respect returned order.

134. EXPERIENCE SORTING

Backend:

current DESC
startDate DESC
order ASC

Frontend should respect returned order.

135. EDUCATION SORTING

Backend:

current DESC
startDate DESC
order ASC

Frontend should respect returned order.

136. SKILL SORTING

Backend:

category ASC
featured DESC
order ASC
name ASC

Frontend should respect returned order.

137. CERTIFICATE VALIDATION EXPECTATIONS

Certificate fields include:

title
issuer
issueDate
credentialId
credentialUrl
image
description
order
isVisible

Important limits include:

title: 2–150 characters
issuer: 2–150 characters
description: max 500
credentialId: max 150
credentialUrl: max 2048
order: 0–1,000,000

Frontend validation should follow backend validator/model rules.

138. PROJECT VALIDATION EXPECTATIONS

Important limits:

title: 2–100
shortDescription: max 250
description: max 5000
category: max 50
technology: 1–50 each
technologies: 1–30
gallery images: max 10

Project statuses:

completed
in-progress
planned
139. EXPERIENCE VALIDATION EXPECTATIONS

Important limits:

company: 2–150
position: 2–150
location: max 150
description: max 3000

Backend validates:

endDate >= startDate

If:

current === true

backend sets:

endDate = null
140. SKILL VALIDATION EXPECTATIONS
name: 2–50
proficiency: 0–100
description: max 500
icon: max 100
order: >= 0

Category must be one of the backend-supported values.

141. SITE SETTINGS VALIDATION EXPECTATIONS

Important fields:

siteName: 2–100
developerName: 2–100
tagline: max 200
bio: max 3000
contactEmail: valid email
location: max 100

SEO:

metaTitle: max 70
metaDescription: max 160
keywords: array

Social URLs should use:

http://
https://
142. CONTACT VALIDATION EXPECTATIONS

Important backend limits:

name: 2–100
email: max 254
subject: 3–200
message: 10–5000

Frontend should provide useful character counters.

Example:

Message
0 / 5000
143. SECURITY

Frontend must never trust itself as the security boundary.

Backend remains authoritative.

Frontend should still:

Avoid storing JWT
Avoid rendering unsafe HTML
Validate user input
Sanitize rich content when applicable
Avoid dangerous URL protocols
Avoid exposing private API responses
Avoid logging sensitive data
144. XSS CONSIDERATION

If project/blog descriptions or other content can contain HTML:

Do NOT blindly render:

dangerouslySetInnerHTML

unless content is known to be sanitized/trusted.

If rich text is required, use a controlled sanitization strategy.

145. CONSOLE LOGGING

Do not leave development logs such as:

console.log(data);
console.log(response);
console.log(req.file);

in production frontend code.

Use appropriate error reporting/debugging strategy.

146. PERFORMANCE

Use:

Lazy loading
Image optimization
Responsive images where practical
React Query caching
Avoid unnecessary refetching
Component memoization only when useful
Avoid rendering huge lists unnecessarily
147. IMAGE PERFORMANCE

For portfolio images:

Use responsive sizing
Use object-cover or appropriate object-fit
Preserve aspect ratio
Lazy-load below-the-fold images
Use meaningful alt text

Hero/above-the-fold images can be loaded with higher priority when appropriate.

148. SEO

Public portfolio should support:

Meaningful page titles
Meta descriptions
Semantic headings
Canonical URLs where appropriate
OpenGraph support based on the existing frontend architecture
Good URL structure
Accessible content

Current Site Settings frontend UI should not expose:

seo.ogImage

unless backend/frontend requirements are explicitly changed.

149. PUBLIC ROUTES

Recommended conceptual public routes:

/
 /projects
 /projects/:slug
 /certificates
 /experience
 /education
 /contact

Resume can be accessed through a button/action rather than necessarily requiring a dedicated page.

Use the existing frontend routing architecture if already established.

150. ADMIN ROUTES

Recommended conceptual routes:

/admin/login

/admin
/admin/projects
/admin/projects/new
/admin/projects/:id/edit

/admin/certificates
/admin/certificates/new
/admin/certificates/:id/edit

/admin/experience
/admin/experience/new
/admin/experience/:id/edit

/admin/education
/admin/education/new
/admin/education/:id/edit

/admin/skills

/admin/resume

/admin/contacts

/admin/settings

These are frontend route recommendations only.

Follow the existing frontend route architecture if already implemented.

151. ROUTE PROTECTION

Admin routes should be protected at the frontend level for UX.

Example:

/admin/*
     ↓
Auth state
     ↓
Authenticated?
   ┌────┴────┐
   │         │
  Yes        No
   │         │
Content     Login

However:

Frontend route protection is not a replacement for backend authentication.

Every backend mutation remains protected independently.

152. SITE MAINTENANCE MODE

Backend exposes:

isMaintenanceMode

Frontend can use it to determine whether the public site should show a maintenance state.

Potential public experience:

We'll be back soon.

The portfolio is temporarily unavailable while updates are being made.

Admin dashboard should remain usable for authorized administrators if backend allows it.

Do not assume maintenance mode automatically blocks API access.

153. DATA FETCHING PRINCIPLES

Public pages:

Fetch only what is required.

Admin pages:

Fetch management data when the feature is opened.

Avoid loading every admin resource globally on dashboard startup unless required.

154. ADMIN DATA TABLE ACTIONS

For each resource:

View
Edit
Delete

Where supported:

Toggle visibility
Toggle active
Set featured
Set active resume

Actions should be accessible through both:

Desktop UI
Keyboard navigation
Mobile-friendly menus
155. CONFIRMATION DIALOGS

Use dialogs for destructive operations.

Examples:

Delete project
Delete certificate
Delete experience
Delete education
Delete skill
Delete resume
Delete contact
Delete profile image
Delete site settings

Do not require confirmation for harmless operations such as opening/editing.

156. TOAST + DIALOG RULE

Do not use toast as the only confirmation for destructive operations.

Bad:

Click Delete
↓
Immediately delete
↓
Toast

Better:

Click Delete
↓
Confirmation dialog
↓
Confirm
↓
Delete
↓
Toast
157. MODAL/SHEET FORM UX

For smaller forms:

Dialog / Sheet

For complex forms:

Dedicated page

Do not put extremely large forms into tiny dialogs.

158. ADMIN FORM LAYOUT

Recommended:

Page Header
    ↓
Form Card
    ↓
Sections
    ├── Basic Information
    ├── Content
    ├── Media
    ├── Metadata
    └── Publishing/Visibility
    ↓
Sticky Action Bar
    ├── Cancel
    └── Save
159. PROJECT FORM SECTIONS
Basic Information
├── Title
├── Category
└── Short Description

Project Content
├── Description
└── Technologies

Links
├── GitHub
└── Live Demo

Media
├── Primary Image
└── Gallery

Metadata
├── Status
├── Featured
└── Order
160. CERTIFICATE FORM SECTIONS
Certificate Information
├── Title
├── Issuer
├── Issue Date

Credential
├── Credential ID
└── Credential URL

Media
└── Certificate Image

Display
├── Description
├── Visibility
└── Order
161. EXPERIENCE FORM SECTIONS
Position
├── Company
├── Position
├── Employment Type
└── Location

Timeline
├── Start Date
├── End Date
└── Current

Details
├── Description
├── Responsibilities
└── Technologies

Company
├── Company URL
└── Company Logo

Display
├── Featured
└── Order
162. SKILL FORM SECTIONS
Skill
├── Name
├── Category
├── Proficiency
├── Icon
└── Description

Display
├── Featured
├── Active
└── Order
163. CONTACT PRIVACY

The backend controller attempts to collect:

IP address
User agent

but the provided Contact model does not currently define those fields.

Therefore frontend should NOT expect:

ipAddress
userAgent

in contact API responses.

Do not build UI around these fields unless the backend contract is explicitly changed.

164. CONTACT EMAIL BEHAVIOR

When a public contact message is created:

Contact saved
      ↓
Email notification attempted
      ↓
Response returned

Email delivery failure is logged by backend and does not necessarily mean the contact creation failed.

Frontend should therefore treat the API success response as successful contact submission.

165. CLOUDINARY CLEANUP

The backend generally follows:

Database update
      ↓
Cloudinary cleanup

or:

Upload new asset
      ↓
Database update
      ↓
Delete old asset

Frontend should not duplicate this cleanup logic.

166. RESOURCE OWNERSHIP

Frontend should treat:

publicId

as an opaque backend-managed identifier.

Do not modify it.

Do not generate it.

Do not assume its Cloudinary structure.

167. API RETRIES

Do not blindly retry every mutation.

Safe general strategy:

GET → retry can be reasonable
POST/PATCH/DELETE → avoid automatic repeated mutation unless carefully controlled

Especially avoid duplicate contact submissions.

168. CONTACT DUPLICATE SUBMISSION

While sending:

Disable submit button

This is important because contact endpoint is public and rate-limited.

169. AUTH REQUEST DUPLICATION

Do not repeatedly call:

GET /auth/me

from every protected component.

Use a centralized authentication query/state.

170. PUBLIC DATA CACHING

Reasonable React Query stale times can be used for:

Projects
Certificates
Experience
Education
Skills
Site Settings
Resume

The exact values should follow actual application requirements.

171. STALE DATA

When admin updates content:

Mutation success
↓
Invalidate affected query
↓
Public/admin UI receives current data

Do not leave stale content visible after a successful mutation.

172. IMAGE PREVIEW

For locally selected images, preview using browser-supported temporary URLs.

Do not upload an image simply to generate a preview.

173. FORM RESET

After successful creation:

Reset form
Clear temporary image
Close modal if applicable
Refresh list

After successful update:

Keep user informed
Refresh data
Return to list if appropriate

Do not automatically navigate away if the user may want to continue editing unless that matches existing UX.

174. ACCESSIBLE FILE INPUT

File upload should include:

Visible label
Accepted file information
File size information
Keyboard accessibility
Error message

Example:

Certificate Image

PNG, JPG or WebP
Maximum 5 MB

Use actual backend upload limits supplied by the upload middleware/validators.

175. ERROR BOUNDARIES

Use React error boundaries for major application areas.

A component crash should not necessarily destroy the entire application.

Fallback:

Something went wrong.

Please refresh the page.
176. NOT-FOUND UI

For missing resources:

Project not found

Provide:

Back to Projects

Do not show a generic empty screen.

177. NETWORK OFFLINE UX

Where practical, detect network failures and communicate:

You're offline or the server is unavailable.

For forms:

Your changes could not be saved.

Preserve form state where possible.

178. ACCESSIBILITY OF TOASTS

Toast messages should not be the only place important information exists.

Critical form errors must also appear inline.

179. ACCESSIBILITY OF STATUS BADGES

Bad:

red dot

Better:

Status: In Progress

The visual style can supplement the text.

180. ACCESSIBILITY OF ICON-ONLY BUTTONS

Icon-only buttons require accessible labels.

Example concept:

Delete

must have an accessible name even if only a trash icon is visually displayed.

181. IMAGE ALT TEXT

Use meaningful alt text.

Project:

Screenshot of [Project Name]

Certificate:

[Certificate Title] certificate

Company logo:

[Company Name] logo

Decorative images:

alt=""

when genuinely decorative.

182. CONTENT PRESENTATION

Portfolio content should follow a clear hierarchy:

Problem
↓
Solution
↓
Technology
↓
Implementation
↓
Result

Projects should communicate actual work rather than just listing technologies.

183. PROJECT DETAIL QUALITY

A project page should ideally communicate:

What was built?
Why was it built?
What problem did it solve?
What technologies were used?
What was technically challenging?
How was it implemented?
What was the result?

The frontend should provide enough visual hierarchy to make these details easy to scan.

184. PUBLIC HOME PAGE

Recommended structure:

Hero
    ↓
About / Introduction
    ↓
Skills
    ↓
Featured Projects
    ↓
Experience
    ↓
Education
    ↓
Certificates
    ↓
Resume CTA
    ↓
Contact
    ↓
Footer

Follow existing frontend architecture if already established.

185. HERO SECTION

Should quickly communicate:

Who you are
What you build
What technologies/domain you work in
Primary CTA
Secondary CTA

Example CTA concepts:

View Projects
Download Resume
Contact Me

Do not overwhelm the hero with excessive animation.

186. FEATURED PROJECTS

Use:

GET /projects/featured

Display only backend-selected featured projects.

Do not duplicate featured filtering in the frontend unless required for presentation.

187. EXPERIENCE SECTION

Use:

GET /experiences

Respect backend ordering.

Current experiences should visually indicate:

Present
188. EDUCATION SECTION

Use:

GET /educations

Respect backend ordering.

189. CERTIFICATES SECTION

Use:

GET /certificates

Backend already filters invisible certificates.

Frontend should not need to implement the visibility filter itself.

190. SKILLS SECTION

Use:

GET /skills

Optional category filtering:

GET /skills?category=frontend
191. RESUME CTA

Fetch:

GET /resume

If no active resume exists:

Do not show broken download link
Hide/disable resume CTA appropriately

Example:

Resume currently unavailable.
192. SITE SETTINGS INITIALIZATION

Public application startup can fetch:

GET /site-settings

Use it for:

Developer name
Site name
Tagline
Bio
Contact email
Location
Social links
SEO
Maintenance mode
Profile image
193. MISSING SITE SETTINGS

Backend can return:

404

if settings do not exist.

Frontend should provide a graceful fallback rather than crashing the application.

194. SETTINGS CREATION

Admin settings UI should support the possibility that settings do not yet exist.

Conceptual flow:

GET /site-settings
        ↓
404?
        ↓
Show setup form
        ↓
POST /site-settings

Do not assume settings always exist.

195. SETTINGS UPDATE

Normal settings:

PATCH /site-settings

Profile image must use dedicated endpoints.

Do not send profile image changes through the normal settings endpoint.

196. PROFILE IMAGE SEPARATION

Normal settings:

PATCH /site-settings

Profile image:

POST /site-settings/profile-image
PATCH /site-settings/profile-image
DELETE /site-settings/profile-image

Keep these responsibilities separated in the frontend API layer.

197. ADMIN API SECURITY

All admin mutations should be treated as authenticated operations:

Projects
Certificates
Experience
Education
Skills
Resume metadata
Site settings
Profile image
Contacts

The frontend should assume authentication is required and handle 401 responses gracefully.

198. IMPORTANT BACKEND SECURITY ISSUE — RESUME

Current backend route for:

POST /resume

contains:

uploadRateLimiter
resumeUploadMiddleware

but currently does not include:

authMiddleware

The controller indicates this is intended to be an admin upload operation.

This is a backend authorization issue.

Frontend should NOT attempt to compensate for this.

It should be corrected in the backend before production.

199. IMPORTANT BACKEND CONTRACT ISSUE — CONTACT STATUS

The Contact model defines:

new
in-progress
resolved
archived

but the contact service currently validates:

new
read
replied
archived

These contracts conflict.

Frontend should not invent a combined list.

Resolve the backend contract before finalizing the Contact Status UI.

200. IMPORTANT BACKEND ISSUE — CONTACT METADATA

The controller/service attempts to save:

ipAddress
userAgent

but the provided Contact model does not define these fields.

Therefore the frontend should not expect these properties.

If they are intentionally required for admin/audit purposes, the backend model needs to be changed explicitly.

201. IMPORTANT BACKEND ISSUE — PUBLIC SKILLS

The skill service supports:

activeOnly

but current public controller behavior does not appear to request:

activeOnly: true

Therefore inactive skills may be returned publicly.

Frontend should not silently assume inactive skills are filtered.

202. IMPORTANT BACKEND ISSUE — PROJECT PUBLISHED

Project model does not contain:

published

Therefore frontend must not implement published filtering.

Current project visibility is based on the existing backend behavior.

203. IMPORTANT BACKEND ISSUE — DEBUG LOGGING

The Site Settings profile-image controller currently contains a raw debug log similar to:

console.log("PROFILE IMAGE FILE:", req.file);

This should not be relied upon by the frontend and should be removed/replaced with appropriate backend logging before production.

204. IMPORTANT BACKEND ISSUE — UPLOAD DUPLICATION

There is a generic:

POST /upload/project-image

endpoint in addition to project-specific image upload endpoints.

This may be redundant.

Do not remove it without approval.

205. FRONTEND SHOULD NOT FIX BACKEND CONTRACTS

If frontend discovers:

Route mismatch
Response mismatch
Validation mismatch
Authentication mismatch
Missing field
Incorrect status enum
Missing authorization

do not silently modify the backend.

Instead:

Identify the exact problem
Explain the impact
Propose the smallest backend change
Ask for approval if backend modification is required
206. API SERVICE DESIGN

Use one API module per major resource.

Example:

api/
├── axios.js
├── authApi.js
├── projectsApi.js
├── certificatesApi.js
├── experiencesApi.js
├── educationApi.js
├── skillsApi.js
├── resumeApi.js
├── contactsApi.js
└── siteSettingsApi.js
207. API FUNCTIONS

Example structure:

export const getProjects = async () => {
  const response = await api.get("/projects");

  return response.data;
};

export const getProjectBySlug = async (slug) => {
  const response = await api.get(`/projects/slug/${slug}`);

  return response.data;
};

The component should not know backend URL construction details.

208. REACT QUERY ARCHITECTURE

Example:

Component
    ↓
useQuery / useMutation
    ↓
Feature API function
    ↓
Axios
    ↓
Backend

This keeps:

UI
Server state
API communication

separated.

209. MUTATION UX

For every mutation:

User action
    ↓
Disable relevant control
    ↓
Show loading state
    ↓
Request
    ↓
Success/Error
    ↓
Toast
    ↓
Invalidate queries
210. OPTIMISTIC UPDATES

Use only when the behavior is simple and rollback is reliable.

For destructive/resource-heavy operations, normal mutation + refetch is safer.

Do not implement optimistic updates merely for visual speed.

211. SEARCH/FILTER UI

If the backend does not provide a search/filter endpoint, do not pretend it does.

Possible approach:

Fetch dataset
↓
Client-side filter

only when dataset size is small and appropriate.

For large datasets, request backend support rather than building inefficient frontend filtering.

212. PAGINATION

The currently provided APIs do not expose pagination parameters for the listed resources.

Therefore do not build a fake server-side pagination system.

If datasets are small:

Render all returned records.

If pagination becomes necessary, it requires backend API support.

213. SORTING

Backend already sorts most resources.

Frontend should generally preserve the returned order.

Do not re-sort data unnecessarily.

214. FORM DATA ARRAYS

Multipart fields such as:

technologies
responsibilities

must match the backend parser/normalizer behavior.

Do not arbitrarily send:

JSON.stringify(array)

unless the backend explicitly expects that format.

Follow the existing backend parser/validator.

215. BOOLEAN FORM DATA

Multipart requests commonly serialize booleans as strings.

Example:

featured = "true"

The frontend must follow the backend's expected parsing behavior.

Do not assume:

FormData

automatically sends actual JavaScript booleans.

216. DATE FORM DATA

Use backend-compatible date strings.

Prefer:

YYYY-MM-DD

for date-only form controls when backend parsing supports it.

Avoid unnecessarily converting dates to locale strings before submission.

217. FILE INPUT UX

Display:

Selected file
File size
File type
Preview if image

Allow:

Replace
Remove

before submission where appropriate.

218. SECURITY — EXTERNAL LINKS

For external URLs:

GitHub
Live Demo
Credential
Company
Social

only render values returned by backend.

Use safe protocols.

Do not allow arbitrary dangerous protocols.

219. SECURITY — HTML CONTENT

Project descriptions and similar content may be plain text.

Prefer rendering as text.

Only render HTML if the backend/content pipeline explicitly supports sanitized HTML.

220. SECURITY — SENSITIVE DATA

Never display or log:

JWT
password
SMTP password
Cloudinary credentials
database URI
private environment variables
221. PERFORMANCE — API

Avoid:

GET /projects

being called repeatedly by many components.

Centralize the query.

Example:

ProjectsPage
    ↓
useProjects()

rather than multiple components independently fetching the same endpoint.

222. PERFORMANCE — COMPONENTS

Avoid premature memoization.

Use memoization where:

Expensive calculations exist
Large lists rerender unnecessarily
Stable callback references matter

Do not wrap every component in memo.

223. PERFORMANCE — IMAGES

Use:

object-cover

or:

object-contain

based on content.

Reserve high-priority image loading for important above-the-fold images.

Lazy-load large galleries.

224. PROFESSIONAL DESIGN PRINCIPLES

The design should feel:

Minimal
Modern
Technical
Premium
Professional
Readable
Confident

Avoid:

Overly flashy gradients
Excessive glassmorphism
Excessive animations
Huge decorative elements
Poor contrast
Too many colors
Crowded cards
225. DESIGN SYSTEM

Maintain consistency for:

Typography
Spacing
Radius
Buttons
Inputs
Cards
Badges
Dialogs
Toast
Shadows
Borders
Colors

Do not create a different button/card style for every feature.

226. DARK/LIGHT MODE

If existing frontend architecture supports both themes:

Ensure:

Text contrast
Input visibility
Border visibility
Image presentation
Dialog contrast
Focus states
Toast readability

are correct in both modes.

227. CARD DESIGN

Cards should use a consistent system.

Example hierarchy:

Image
    ↓
Metadata
    ↓
Title
    ↓
Description
    ↓
Tags
    ↓
Actions

Do not overload cards with every available backend field.

228. ADMIN UX PRINCIPLE

Admin interfaces should prioritize:

Clarity
Speed
Predictability
Error prevention
Easy editing

over decorative visual effects.

229. PUBLIC UX PRINCIPLE

Public portfolio should prioritize:

Storytelling
Scanning
Project evidence
Navigation
Accessibility
Performance
230. MOBILE-FIRST PRINCIPLE

Always design:

Mobile
    ↓
Tablet
    ↓
Desktop

not:

Desktop
    ↓
Shrink everything for mobile
231. RESPONSIVE FORMS

Desktop:

Two-column where useful

Mobile:

Single-column

Do not squeeze inputs into unusable widths.

232. TOUCH TARGETS

Interactive controls should be comfortably tappable.

Avoid tiny:

16px × 16px

icon buttons unless they are part of a larger accessible hit area.

233. ADMIN DELETE BUTTONS

Keep destructive actions visually separated from primary actions.

Example:

[Save Changes]

                    [Delete Project]

rather than:

[Delete] [Save]

with equal visual priority.

234. ERROR COPY

Good:

Unable to save the project. Please check the highlighted fields.

Bad:

AxiosError: Request failed with status code 400
235. VALIDATION COPY

Good:

Project title must be at least 2 characters.

Bad:

Invalid input.

Where backend-specific validation details are known, make the message actionable.

236. SUCCESS COPY

Keep it concise:

Changes saved successfully.

Avoid:

Your request has been successfully processed and all database operations have completed.
237. PUBLIC CONTACT UX

The contact form should feel trustworthy.

Include:

Name
Email
Subject
Message

Optionally:

Expected response time

only if actual information exists.

Do not invent guarantees.

238. PUBLIC SOCIAL LINKS

Use only links available in:

settings.socialLinks

If a social link is absent:

Do not render the icon/link.

Avoid dead social icons.

239. FOOTER

Can use:

Developer Name
Short tagline
Social links
Copyright
Contact

Use Site Settings data where appropriate.

240. PROFILE IMAGE

Use:

settings.profileImage.url

If missing:

Use initials
Use neutral placeholder
Maintain layout dimensions

Do not show broken image icons.

241. MAINTENANCE MODE

If enabled:

isMaintenanceMode === true

public UI can display a dedicated maintenance page.

However:

Do not assume the backend blocks all public API requests.

The frontend should follow the intended product behavior.

242. FINAL API REFERENCE
Authentication
POST   /auth/login
GET    /auth/me
POST   /auth/logout
POST   /auth/create-admin
Projects
GET    /projects
GET    /projects/featured
GET    /projects/slug/:slug
GET    /projects/:id

GET    /projects/admin/all

POST   /projects
PATCH  /projects/:id
DELETE /projects/:id

POST   /projects/:id/images
DELETE /projects/:id/images
Certificates
GET    /certificates
GET    /certificates/:id

GET    /certificates/admin
GET    /certificates/admin/:id

POST   /certificates
PATCH  /certificates/:id

POST   /certificates/:id/image
DELETE /certificates/:id/image

DELETE /certificates/:id
Experience
GET    /experiences
GET    /experiences/:id

POST   /experiences
PATCH  /experiences/:id
DELETE /experiences/:id
Education
GET    /educations
GET    /educations/:id

POST   /educations
PATCH  /educations/:id
DELETE /educations/:id
Skills
GET    /skills
GET    /skills/:id

POST   /skills
PATCH  /skills/:id
DELETE /skills/:id

Optional:

GET /skills?category=frontend
Resume
GET    /resume

POST   /resume
PATCH  /resume/:id
DELETE /resume/:id
Site Settings
GET    /site-settings

POST   /site-settings
PATCH  /site-settings
DELETE /site-settings
Profile Image
POST   /site-settings/profile-image
PATCH  /site-settings/profile-image
DELETE /site-settings/profile-image
Contact
POST   /contact

GET    /contact
GET    /contact/:id

PATCH  /contact/:id/status
PATCH  /contact/:id/read

DELETE /contact/:id
Generic Upload
POST /upload/project-image
Health
GET /health
243. AUTHENTICATION MATRIX
Feature	Public GET	Admin GET	Create	Update	Delete
Projects	Yes	Yes	Auth	Auth	Auth
Certificates	Yes	Yes	Auth	Auth	Auth
Experience	Yes	Existing admin route if provided	Auth	Auth	Auth
Education	Yes	Existing admin route if provided	Auth	Auth	Auth
Skills	Yes	Existing admin route if provided	Auth	Auth	Auth
Resume	Yes	N/A in provided route	⚠️ Auth missing	Auth	Auth
Site Settings	Yes	N/A	Auth	Auth	Auth
Profile Image	N/A	N/A	Auth	Auth	Auth
Contacts	No	Auth	Public contact	Auth	Auth
244. RESOURCE RESPONSE REFERENCE
Projects
{
  "success": true,
  "count": 5,
  "projects": []
}

Individual:

{
  "success": true,
  "project": {}
}
Certificates
{
  "success": true,
  "data": []
}

Individual:

{
  "success": true,
  "data": {}
}
Experience

Responses use:

{
  "success": true,
  "experience": {}
}
Resume
{
  "success": true,
  "resume": {}
}
Site Settings
{
  "success": true,
  "settings": {}
}
Skills
{
  "success": true,
  "count": 10,
  "skills": []
}
Contacts
{
  "success": true,
  "count": 10,
  "contacts": []
}
245. IMPORTANT FRONTEND RULES
Rule 1 — Backend Is Source of Truth

Do not invent API fields.

Rule 2 — Do Not Guess Routes

Use the documented routes exactly.

Rule 3 — Do Not Guess Response Shapes

Each API module should handle its actual response.

Rule 4 — Do Not Store JWT

Authentication is cookie-based.

Rule 5 — Do Not Change Backend

If frontend requires backend changes:

Explain why
↓
Identify exact change
↓
Ask for approval
Rule 6 — Do Not Fake Features

If backend does not support:

search
pagination
published
reordering

do not pretend the API supports them.

Rule 7 — Backend Validation Wins

Frontend validation improves UX but backend validation is authoritative.

Rule 8 — Handle Every UI State

Every API feature should support:

Loading
Success
Error
Empty
Retry
Disabled
Rule 9 — Accessibility Is Required

Accessibility is not optional polish.

Rule 10 — Reuse Components

Avoid creating five slightly different versions of:

Button
Dialog
Card
Input
Uploader
Status Badge
Empty State
246. FINAL FRONTEND QUALITY CHECKLIST
Architecture
 Existing frontend architecture preserved
 Axios centralized
 React Query used for server state
 API modules separated from components
 Reusable components created
 No unnecessary dependencies
Authentication
 withCredentials: true
 No localStorage token
 No sessionStorage token
 No Authorization header
 /auth/me centralized
 Admin routes protected
 401 handled correctly
 Logout clears private state
Projects
 Project listing works
 Featured projects work
 Slug detail works
 Admin CRUD works
 Primary image upload works
 Gallery upload works
 Gallery limit respected
 Image deletion works
 No published assumption
Certificates
 Public visibility handled
 Admin CRUD works
 Image upload works
 Image replacement works
 Image deletion works
 Credential link conditional
 Visibility UI implemented
Experience
 Timeline works
 Current position handled
 End date conditional
 Company logo works
 Responsibilities supported
 Technologies supported
 Admin CRUD works
Education
 Timeline/card works
 Current education supported
 Admin CRUD works
 Correct dates
 Correct ordering
Skills
 Category support
 Category filtering
 Proficiency input
 Featured state
 Active state
 Admin CRUD
 No incorrect inactive filtering assumption
Resume
 Public resume fetch
 View resume
 Download resume
 Admin upload
 PDF handling
 Active state
 Delete
 ⚠️ Backend POST authorization issue documented
Site Settings
 General settings
 Social links
 SEO
 Maintenance mode
 Profile image
 Create settings
 Update settings
 Delete settings
 No resumeUrl
 No seo.ogImage UI field
Contact
 Public contact form
 Validation
 Loading state
 Success toast
 Error handling
 Duplicate-submit prevention
 Admin inbox
 Read/unread
 Status management
 Delete confirmation
 ⚠️ Backend status contract resolved before final implementation
Uploads
 Preview
 File validation
 Loading state
 Error state
 Replace/remove
 Accessible uploader
 Correct multipart field names
UX
 Loading states
 Empty states
 Error states
 Retry states
 Toast messages
 Confirmation dialogs
 Unsaved-change handling where appropriate
 No confusing technical error messages
Accessibility
 Semantic HTML
 Correct headings
 Labels
 Keyboard navigation
 Focus management
 Accessible dialogs
 Accessible icon buttons
 Visible focus states
 Color not used as sole information
 Reduced motion support
 Good contrast
Responsive
 320px
 375px
 768px
 1024px
 1280px
 1536px+
 Mobile navigation
 Responsive forms
 Responsive tables
 Responsive images
 No unnecessary horizontal scrolling
Performance
 React Query caching
 No duplicate API requests
 Lazy-loaded images
 Responsive images
 No unnecessary rerenders
 Large galleries handled efficiently
 Animations remain lightweight
247. FINAL IMPLEMENTATION PRINCIPLE

The frontend should be built around this architecture:

                    ┌─────────────────────┐
                    │      Backend        │
                    │   Source of Truth   │
                    └──────────┬──────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Axios         │
                    │ Central API Client  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Feature APIs     │
                    │ projectsApi etc.    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    React Query      │
                    │  Server State       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Feature Components  │
                    │ Forms / Cards / UI  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Professional UI   │
                    │ UX + Accessibility  │
                    └─────────────────────┘

The implementation goal is:

Backend Compatibility
        +
Clean Architecture
        +
Reusable Components
        +
Accessible UX
        +
Professional Visual Design
        +
Reliable Error Handling
        +
Responsive Design
        +
Good Performance
```
