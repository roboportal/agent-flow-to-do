class CreateTasks < ActiveRecord::Migration[8.1]
  def change
    create_table :tasks do |t|
      t.string :title, null: false, limit: 255
      t.text :description
      t.boolean :completed, default: false, null: false

      t.timestamps
    end
    
    add_index :tasks, :completed
    add_index :tasks, :created_at
  end
end
