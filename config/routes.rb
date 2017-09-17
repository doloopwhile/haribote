Rails.application.routes.draw do
  root to: 'top#show'

  resource :editor, only: [:show]

  namespace :api do
    post 'parsing/png'
    post 'parsing/zip'
    post 'saving/zip'
  end
end
