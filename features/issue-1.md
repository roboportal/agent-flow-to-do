# Summary

Build a Ruby on Rails to-do application from scratch that provides complete CRUD (Create, Read, Update, Delete) functionality for managing to-do items. This application will use PostgreSQL as the database and include a Docker Compose setup for simplified local development environment that eliminates the need for manual database installation and configuration.

## Goals

- Create a basic Rails application structure for task management
- Implement full CRUD operations for to-do items (create, read, update, delete)
- Use PostgreSQL as the database with Active Record as the ORM
- Provide a simple web interface for users to interact with their to-dos
- Set up a containerized development environment using Docker Compose for easy setup
- Establish the foundation for future task management features

## Non-goals

- User authentication or multi-user support
- Advanced task features (due dates, priorities, categories)
- API endpoints for mobile/external applications
- Task sharing or collaboration features
- Email notifications or reminders
- Production deployment configurations

## Technical Approach

This will be a standard Rails application following MVC architecture with PostgreSQL as the database, containerized using Docker Compose:

**Docker Environment Setup:**
- Use Docker Compose to orchestrate Rails app and PostgreSQL database containers
- Configure PostgreSQL service with proper credentials and volume persistence
- Set up Rails service with proper database connection to PostgreSQL container
- Include development-friendly configurations (code mounting, port forwarding)
- Provide simple `docker-compose up` command for complete environment setup

**Database Setup:**
- Configure PostgreSQL as the primary database using the `pg` gem
- Use Active Record as the ORM for all database interactions
- Set up database configuration to connect to PostgreSQL container
- Configure database settings via environment variables for container compatibility

**Model Layer:**
- Create a `Todo` model using Active Record with essential attributes: title (required), description (optional), completed status (boolean, default false), and timestamps
- Add Active Record validations to ensure data integrity
- Use Rails conventions for table naming and structure

**Controller Layer:**
- Implement a `TodosController` with all seven RESTful actions (index, show, new, create, edit, update, destroy)
- Use standard Rails patterns for parameter handling and redirects
- Include flash messages for user feedback
- Follow Rails controller conventions and Active Record query patterns

**View Layer:**
- Create view templates for listing todos (index), viewing individual todos (show), and forms for creating/editing (new/edit)
- Use Rails form helpers and partials to reduce code duplication
- Implement basic styling for a clean, functional interface

**Routing:**
- Use Rails resource routing to automatically generate all CRUD routes
- Set the todos index as the root route for immediate access

**Development Environment:**
- Provide Docker Compose configuration for complete environment setup
- Include comprehensive setup instructions using Docker
- Configure PostgreSQL connection for containerized development
- Include sample data seeding for development

The application will follow Rails conventions throughout, making it maintainable and allowing for easy extension in future iterations.

## Files to Modify

| File | Description |
|------|-------------|
| `docker-compose.yml` | Docker Compose configuration for Rails app and PostgreSQL services |
| `Dockerfile` | Rails application Docker image configuration |
| `README.md` | Update to include Docker-based setup instructions |
| `.dockerignore` | Docker ignore file for build optimization |

## Open Questions

None.

## Acceptance Criteria

- [ ] Application uses Docker Compose for local development environment setup
- [ ] Developers can start the entire stack (Rails + PostgreSQL) with `docker-compose up`
- [ ] Application uses PostgreSQL as the database with proper container configuration
- [ ] All database interactions use Active Record as the ORM
- [ ] Setup instructions in README allow developers to get the app running with Docker in minimal steps
- [ ] Users can view a list of all to-do items on the main page
- [ ] Users can create new to-do items with a title and optional description
- [ ] Users can view the details of an individual to-do item
- [ ] Users can edit existing to-do items
- [ ] Users can delete to-do items with confirmation
- [ ] Users can mark to-do items as completed/uncompleted
- [ ] The application displays appropriate success/error messages for all operations
- [ ] All forms include proper validation and error handling
- [ ] The interface is clean and functional with basic styling
- [ ] All CRUD operations work correctly without errors
- [ ] The application follows Rails conventions and best practices
- [ ] Database migrations run successfully within the container environment
- [ ] Sample seed data is available for development testing
- [ ] PostgreSQL data persists between container restarts via Docker volumes
