class EditorsController < ApplicationController
  include Magick

  def show
    load_image_data = lambda do |f|
      im = Image.read(f).first
      im.rows.times.flat_map { |r| 
        im.export_pixels(0, r, im.columns, 1, 'RGBA').map {|x| x / 256 }
      }
    end

    @props = {}

    @props[:skin] = {
      width: 64,
      height: 64,
      layers: [
        { 
          label: 'あたま',
          data: load_image_data['/home/kenjiomoto/Desktop/skin1.png'],
          visible: true
        },
        {
          label: 'からだ',
          data: load_image_data['/home/kenjiomoto/Desktop/skin2.png'],
          visible: false
        }
      ]
    }

    hsl = lambda do |h, s, l|
      c = ColorMath::HSL.new(h, s, l)
      [c.red * 255, c.green * 255, c.blue * 255].map(&:to_i)
    end

    colors = [
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
    @props[:colors] = colors
  end
  
  def create
    name = params[:name]
    skin = params[:skin]
    render plain: 'Saved!', layout: false
  end
end
