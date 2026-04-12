Todo.create!([
  {
    title: "Welcome to your Todo App",
    description: "This is your first todo item. You can edit or delete it, or create new ones!",
    completed: false
  },
  {
    title: "Learn Ruby on Rails",
    description: "Explore the MVC architecture and Active Record patterns used in this application.",
    completed: false
  },
  {
    title: "Set up PostgreSQL",
    description: "Configure your local PostgreSQL database for development.",
    completed: true
  },
  {
    title: "Create your first custom todo",
    description: "Try adding your own todo item to see how the application works.",
    completed: false
  }
])

puts "Created #{Todo.count} sample todos"