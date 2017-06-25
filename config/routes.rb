Rails.application.routes.draw do
  root to: 'top#show'

  resource :editor, only: [:show, :create]
end
