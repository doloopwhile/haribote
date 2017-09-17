class EditorsController < ApplicationController
  include Magick

  def create    

    @props = {
      skin: skin,
      colors: colors
    }
  rescue ActionController::ParameterMissing
    flash.now.alert = 'PNGファイルを選択してください'
    render :new
  end

  def show
    @props = {
      colors: colors
    }
  end

  private

  def editor_params
    params.require(:editor).permit(:png, :zip)
  end

  def colors
    hsl = lambda do |h, s, l|
      c = ColorMath::HSL.new(h, s, l)
      [c.red * 255, c.green * 255, c.blue * 255].map(&:to_i)
    end

    [
      hsl[3, 1.0, 0.3],
      hsl[3, 1.0, 0.4],
      hsl[3, 1.0, 0.5],
      hsl[3, 1.0, 0.6],
      hsl[3, 1.0, 0.7],
      hsl[3, 1.0, 0.8],

      hsl[58, 1.0, 0.3],
      hsl[58, 1.0, 0.4],
      hsl[58, 1.0, 0.5],
      hsl[58, 1.0, 0.6],
      hsl[58, 1.0, 0.7],
      hsl[58, 1.0, 0.8],

      hsl[150, 0.7, 0.3],
      hsl[150, 0.7, 0.4],
      hsl[150, 0.7, 0.5],
      hsl[150, 0.7, 0.6],
      hsl[150, 0.7, 0.7],
      hsl[150, 0.7, 0.8],

      hsl[224, 0.8, 0.3],
      hsl[224, 0.8, 0.4],
      hsl[224, 0.8, 0.5],
      hsl[224, 0.8, 0.6],
      hsl[224, 0.8, 0.7],
      hsl[224, 0.8, 0.8],

      hsl[312, 1.0, 0.3],
      hsl[312, 1.0, 0.4],
      hsl[312, 1.0, 0.5],
      hsl[312, 1.0, 0.6],
      hsl[312, 1.0, 0.7],
      hsl[312, 1.0, 0.8],

      hsl[0, 0.0, 0.15],
      hsl[0, 0.0, 0.25],
      hsl[0, 0.0, 0.4],
      hsl[0, 0.0, 0.6],
      hsl[0, 0.0, 0.75],
      hsl[0, 0.0, 0.95],

      hsl[18, 0.5, 0.1],
      hsl[18, 0.5, 0.2],
      hsl[18, 0.5, 0.3],
      hsl[18, 0.5, 0.4],
      hsl[18, 0.5, 0.5],
      hsl[18, 0.5, 0.55],

      hsl[5, 1, 0.8],
      hsl[5, 1, 0.85],
      hsl[5, 1, 0.9],
      hsl[23, 0.7, 0.8],
      hsl[23, 0.7, 0.85],
      hsl[23, 0.7, 0.9],
    ]
  end

  # def png_from_skin(skin)
  #   data = []
  #   skin[:layers].select { |l| l[:visible] }.each do ||
  #   layers: [
  #       { label: 'あたま', data: data, visible: true, kind: :head },
  #       { label: '上半身', data: data, visible: true, kind: :upper_body },
  #       { label: '下半身', data: data, visible: true, kind: :lower_body },
  #       { label: '１２３４５６７８９０ＡＢＣＤＥＦＧ', data: data, visible: true, kind: :head_wear },
  #       { label: '上のふく', data: data, visible: true, kind: :upper_body_wear },
  #       { label: '下のふく', data: data, visible: true, kind: :lower_body_wear },
  #     ]
  # end
end
