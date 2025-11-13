Overview
This document describes the components we implemented for BTReimagined, the methods we used during development, and how each part fits into the overall system design. Our goal was to build a fully client-side Blazor WebAssembly application that interacts with the Blacksburg Transit (BT) API through a secure, serverless intermediary. AI was not used.
Collaboration With Blacksburg Transit
We contacted Blacksburg Transit by phone to request information about their public API and documentation. They referred us to an individual by email who provided the necessary API details. This was the full extent of our communication with BT.
System Architecture and Rationale
BTReimagined is a Blazor Web App running on Blazor WebAssembly. Because the application is entirely client-side and BT’s API cannot be called directly from the browser, we implemented a Cloudflare Worker as our serverless backend. The Worker handles all API requests, enabling the client to remain lightweight while still retrieving secure transit data.
The Blazor WebAssembly front end loads entirely in the user’s browser. It communicates with the Worker for all transit queries, receives POST responses, and processes those responses through our custom parser and calculator functions written in C#.
We use MudBlazor extensively for UI components, including datagrids, dropdowns, and cards. This supports the minimalistic, responsive interface we designed for end users.
Implemented Features
1. Cloudflare Worker
Handles all HTTP requests to the BT API.


Hides API endpoints and keys from the client.


Provides normalized POST responses for the WebAssembly front end.


Ensures BTReimagined remains a secure, serverless client application.


2. C# Data Parsers
Convert Worker responses into structured route, stop, and timing objects.


Validate API data fields and filter out incomplete entries.


Support both timetable and trip-planner features.


3. Route Timing Calculators
Compare scheduled departure times with the most recent actual departure.


Estimate whether a route is early or late.


Return clean, user-readable timing information for display in MudBlazor datagrids.


4. JavaScript Interop for Geolocation
Lightweight JS function prompts the user for location access.


The location data remains entirely on the client’s device.


Blazor receives only the resulting coordinates, which are used to identify the five closest stops.


5. Trip Planner Logic
Finds nearest stops based on user location.


Allows users to select a destination.


Generates an organized datagrid displaying the bus, origin, destination, and estimated arrival time.


Development Process
We used a collaborative workflow that included:
Pair programming sessions for complex system-design decisions, data-parsing logic, and Worker integration.


Individual development tasks for UI components, geolocation handling, and smaller utility functions.


Frequent in-browser testing due to the client-side nature of Blazor WebAssembly.


Manual validation of timing calculations, since verifying accuracy currently requires repeated real-world comparisons.


Relation to System Design
Each implemented feature directly supports our overall architecture:
Cloudflare Worker: Enables secure, serverless access to the BT API, a requirement for a WebAssembly application.


C# Parsers and Calculators: Transform raw API data into timely information the front end can display efficiently.


MudBlazor UI Components: Maintain a clean, consistent interface while managing large amounts of transit data.


Geolocation and Trip Planner: Provide user-centric functionality rooted in client-side execution.


All components are designed to remain efficient and lightweight because the entire application runs within the user’s browser.
Future Work
Although the current system is functional, several major tasks remain:
Integrating a map interface for easier navigation by new or visiting riders.


Expanding parser support for alerts, detours, game-day schedules, and other edge cases.


Improving efficiency across parsers and calculators to minimize client-side load.


Developing automated test cases to reduce reliance on manual data validation.

