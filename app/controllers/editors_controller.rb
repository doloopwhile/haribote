class EditorsController < ApplicationController
  include Magick

  def show
    @props = {
      colors: colors,
    }
    
    t = params[:template]
    if t.present?
      skin = read_template_skin(t)
      @props[:skin] = skin if skin
    end
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

  def read_template_skin(t)
    if t !~ /^[a-z0-9A-Z_\-]+$/
      logger.error("invalid template name: #{t.inspect}")
      return nil
    end

    begin
      d = File.open(Rails.root.join('skins', t + '.zip'), 'rb').read
      SkinParsing.skin_from_zip(d)
    rescue => e
      logger.error("failed to load template: #{t.inspect}, #{e}")  
      return  nil
    end
  end
end
