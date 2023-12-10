# Project 2: Drill and Practice

## Overview

This is a drill and practice project for the second half of the course.  It allows
the users to add questions for topics and then practice answering them. Admins 
can add more topics. The application uses UiKit for styling.

The default admin user is `admin@admin.com` and password `123456`.

## Link
The project is hosted at [https://lauris-drill-and-practice.onrender.com/](https://lauris-drill-and-practice.onrender.com/)

## Running the project
    docker-compose up

## Running tests
    docker compose run --entrypoint=npx e2e-playwright playwright test; docker compose rm -sf

> Replace the chainging symbol `;` with `&&` if you are running on unix.


> ⚠️This drops the database, so you need to run `docker-compose up` again to run the application.