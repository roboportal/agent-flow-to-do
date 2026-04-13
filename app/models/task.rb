class Task < ApplicationRecord
  validates :title, presence: true, length: { maximum: 255 }
  
  scope :completed, -> { where(completed: true) }
  scope :pending, -> { where(completed: false) }
  scope :by_creation_date, -> { order(:created_at) }
end