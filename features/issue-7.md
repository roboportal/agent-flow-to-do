# Technical Specification: Add Sign Up and Sign In

## Summary
Add user registration and authentication to the to-do application with email/password login. This will enable users to create accounts, sign in, and have their tasks associated with their user account, providing data isolation and personalization.

## Goals
- Enable user registration with email and password
- Implement secure sign in functionality
- Associate tasks with authenticated users
- Add basic session management
- Provide sign up, sign in, and sign out user interfaces

## Non-goals
- Password reset functionality
- Social media authentication (OAuth)
- Two-factor authentication
- User profile management beyond basic authentication
- Email verification during registration

## Technical Approach

### Authentication Strategy
Use Rails' built-in `has_secure_password` with bcrypt gem for password hashing. Implement session-based authentication using Rails sessions rather than token-based authentication for simplicity.

### Security Considerations
Ensure CSRF protection is enabled for all authentication endpoints. Rails provides built-in CSRF protection via `protect_from_forgery` which should be verified in ApplicationController. All authentication forms must include CSRF tokens to prevent cross-site request forgery attacks.

### Data Model Changes
Create a User model with email and password fields. Modify the Task model to belong to a User. Use email as the unique identifier for users.

### Authentication Flow
1. **Sign Up**: User provides email and password, system creates account and signs them in
2. **Sign In**: User provides credentials, system validates and creates session
3. **Authorization**: All task operations require authentication, tasks are scoped to current user
4. **Sign Out**: Clear user session and redirect to sign in page

### Controller Architecture
- Create `SessionsController` for sign in/out actions
- Create `UsersController` for registration
- Add `before_action` filters to `TasksController` for authentication
- Implement helper methods in `ApplicationController` for current user and authentication checks

### UI Integration
Add authentication forms using Rails form helpers, integrate with existing Turbo/Stimulus setup. Modify the tasks layout to show user email and sign out option when authenticated.

## Files to Modify

| File | Changes |
|------|---------|
| `Gemfile` | Add `bcrypt` gem for password hashing |
| `db/migrate/xxx_create_users.rb` | Create users table with email, password_digest, timestamps |
| `db/migrate/xxx_add_user_to_tasks.rb` | Add user_id foreign key to tasks table |
| `app/models/user.rb` | New User model with has_secure_password and has_many tasks |
| `app/models/task.rb` | Add belongs_to user association |
| `app/controllers/application_controller.rb` | Add authentication helper methods, error handling, and verify CSRF protection is enabled |
| `app/controllers/users_controller.rb` | New controller for user registration (new, create) |
| `app/controllers/sessions_controller.rb` | New controller for authentication (new, create, destroy) |
| `app/controllers/tasks_controller.rb` | Add authentication filters and scope tasks to current user |
| `config/routes.rb` | Add routes for users, sessions, and update root route logic |
| `app/views/users/new.html.erb` | New registration form |
| `app/views/sessions/new.html.erb` | New sign in form |
| `app/views/layouts/application.html.erb` | Add authentication links and user info display |
| `app/views/tasks/index.html.erb` | Update to show user-specific messaging |

## Open Questions

None.

## Acceptance Criteria

- [ ] Users can register with email and password
- [ ] Registration validates email format and password presence
- [ ] Users can sign in with valid credentials
- [ ] Invalid credentials show appropriate error messages
- [ ] Authenticated users can only see their own tasks
- [ ] Unauthenticated users are redirected to sign in page when accessing tasks
- [ ] Users can sign out and session is properly cleared
- [ ] Tasks created by authenticated users are associated with their account
- [ ] Application layout shows current user email when signed in
- [ ] Application layout shows sign out link when authenticated
- [ ] Database properly stores hashed passwords (not plain text)
- [ ] CSRF protection is properly configured and authentication forms include CSRF tokens
- [ ] All authentication endpoints are protected against CSRF attacks
- [ ] All existing task functionality continues to work for authenticated users