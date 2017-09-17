Rails.application.routes.draw do
  root to: 'top#show'

  resource :editor, only: [:show]

  namespace :api do
    post 'parsing/png'
  end
end
