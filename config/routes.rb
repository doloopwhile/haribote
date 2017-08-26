Rails.application.routes.draw do
  root to: 'top#show'

  resource :editor, only: [:show, :create] do
    post :zip
    post :png
  end
end
