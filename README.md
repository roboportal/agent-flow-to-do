# Todo App

A simple Ruby on Rails todo application with full CRUD functionality, built with PostgreSQL as the database.

## Features

- Create, read, update, and delete todo items
- Mark todos as completed/uncompleted
- Clean, responsive web interface
- PostgreSQL database with Active Record ORM
- Form validation and error handling
- Flash messages for user feedback

## Tech Stack

- Ruby 3.1.0
- Rails 7.0
- PostgreSQL
- HTML/CSS (embedded in layout)

## Prerequisites

- Ruby 3.1.0 (you can use rbenv or rvm to manage Ruby versions)
- PostgreSQL (version 12 or higher recommended)
- Bundler gem

### Installing PostgreSQL

**On macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**On Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. **Install Ruby dependencies:**
   ```bash
   bundle install
   ```

3. **Set up the database:**
   
   Create a PostgreSQL user (optional - you can use existing postgres user):
   ```bash
   sudo -u postgres createuser -s todo_app_user
   ```
   
   Or use environment variables for custom database settings:
   ```bash
   export DATABASE_USER=your_username
   export DATABASE_PASSWORD=your_password
   export DATABASE_HOST=localhost
   export DATABASE_PORT=5432
   ```

4. **Create and set up the database:**
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed
   ```

5. **Start the Rails server:**
   ```bash
   rails server
   ```

6. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

## Database Configuration

The application is configured to work with PostgreSQL out of the box. Database settings can be customized using environment variables:

- `DATABASE_USER` - Database username (default: postgres)
- `DATABASE_PASSWORD` - Database password (default: postgres)  
- `DATABASE_HOST` - Database host (default: localhost)
- `DATABASE_PORT` - Database port (default: 5432)

## Usage

### Creating Todos
1. Click "New Todo" from the main page
2. Enter a title (required) and optional description
3. Optionally mark as completed
4. Click "Create Todo"

### Viewing Todos
- All todos are displayed on the main page (`/`)
- Click "View" on any todo to see full details
- Completed todos are visually distinguished with strikethrough text

### Editing Todos
1. Click "Edit" on any todo
2. Modify the title, description, or completion status
3. Click "Update Todo"

### Deleting Todos
1. Click "Delete" on any todo
2. Confirm the deletion when prompted

## Development

### Running Tests
```bash
rails test
```

### Database Commands
```bash
# Reset database
rails db:drop db:create db:migrate db:seed

# Create a new migration
rails generate migration AddColumnToTodos column_name:string

# Run pending migrations
rails db:migrate

# Rollback last migration
rails db:rollback
```

### Rails Console
```bash
rails console
# or
rails c

# Example queries:
Todo.all
Todo.completed
Todo.pending
Todo.create(title: "New Todo", description: "Description")
```

## Project Structure

```
app/
├── controllers/
│   ├── application_controller.rb
│   └── todos_controller.rb
├── models/
│   └── todo.rb
└── views/
    ├── layouts/
    │   └── application.html.erb
    └── todos/
        ├── index.html.erb
        ├── show.html.erb
        ├── new.html.erb
        ├── edit.html.erb
        └── _form.html.erb
config/
├── database.yml
├── routes.rb
└── application.rb
db/
├── migrate/
│   └── 001_create_todos.rb
└── seeds.rb
```

## Contributing

This is a learning project demonstrating Rails fundamentals. Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).