class Api::SavingController < ApplicationController  
  def zip
    skin = JSON.parse(params.require(:skinJSON))
    send_data(
      SkinSaving.zip_data_from_skin(skin),
      filename: "skin.zip",
      type: "application/zip",
      disposition: :inline
    )
  end
end
