class Api::ParsingController < ApplicationController
  def png
    f = params.require(:file)
    render json: { skin: SkinParsing.skin_from_png(f.read) }
  end

  def zip
    f = params.require(:file)
    render json: { skin: SkinParsing.skin_from_zip(f.read) }
  end
end
