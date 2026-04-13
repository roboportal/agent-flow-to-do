class Task < ApplicationRecord
  validates :title, presence: true, length: { maximum: 255 }
  
  scope :completed, -> { where(completed: true) }
  scope :pending, -> { where(completed: false) }
  scope :ordered, -> { order(created_at: :desc) }
  
  def toggle_completed!
    update!(completed: !completed)
  end
end