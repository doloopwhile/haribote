module SkinParsing  
  class << self
    include Magick
    
    def skin_from_png(png_data)
      data = rgba_from_png_data(png_data)

      {
        width: WIDTH,
        height: HEIGHT,
        layers: [
          { label: 'Head', data: data, visible: true, kind: :head },
          { label: 'Arms', data: data, visible: true, kind: :arms },
          { label: 'Body', data: data, visible: true, kind: :body },
          { label: 'Legs', data: data, visible: true, kind: :legs },

          { label: 'Head wear', data: data, visible: true, kind: :head_wear },
          { label: 'Arms wear', data: data, visible: true, kind: :arms_wear },
          { label: 'Body wear', data: data, visible: true, kind: :body_wear },
          { label: 'Legs wear', data: data, visible: true, kind: :legs_wear },
        ]
      }
    end

    def skin_from_zip(zip_data)
      Tempfile.create do |f|
        File.binwrite(f.path, zip_data)

        Zip::File.open(f.path) do |z|
          index = JSON.parse(z.find_entry("index.json").get_input_stream.read)
          layers = index["layers"].map do |l|
            png_data = z.find_entry(l["file"]).get_input_stream.read
            data = rgba_from_png_data(png_data)
            l.slice("label", "visible", "kind").merge(data: data)
          end
          { width: WIDTH, height: HEIGHT, layers: layers }
        end  
      end
    end

    private
    
    WIDTH = HEIGHT = 64
    
    def rgba_from_png_data(png_data) 
      im = Image.read_inline(Base64.encode64(png_data)).first
      im.rows.times.flat_map { |r| 
        im.export_pixels(0, r, im.columns, 1, 'RGBA').map {|x| x / 256 }
      }
    end
  end
end
