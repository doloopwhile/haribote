import Skin from './skin.jsx'

const LayerSpecs = {
  head: {
    width: 32,
    height: 16,
    planes: {
      top:    { left: 8,  top: 0, width: 8, height: 8 },
      bottom: { left: 16, top: 0, width: 8, height: 8 },
      right:  { left: 0,  top: 8, width: 8, height: 8 },
      front:  { left: 8,  top: 8, width: 8, height: 8 },
      left:   { left: 16, top: 8, width: 8, height: 8 },
      back:   { left: 24, top: 8, width: 8, height: 8 }
    },
    viewMappings: {
      top:    { left: 8,  top: 0 },
      bottom: { left: 16, top: 0 },
      right:  { left: 0,  top: 8 },
      front:  { left: 8,  top: 8 },
      left:   { left: 16, top: 8 },
      back:   { left: 24, top: 8 }
    }
  },
  upper_body: {
    width: 56,
    height: 16,
    planes: {
      body_top:    { left: 20, top: 16, width: 8, height: 4 },
      body_bottom: { left: 28, top: 16, width: 8, height: 4 },
      body_right:  { left: 16, top: 20, width: 4, height: 12 },
      body_front:  { left: 20, top: 20, width: 8, height: 12 },
      body_left:   { left: 28, top: 20, width: 4, height: 12 },
      body_back:   { left: 32, top: 20, width: 8, height: 12 },

      rarm_top:    { left: 44, top: 16, width: 4, height: 4 }, 
      rarm_bottom: { left: 48, top: 16, width: 4, height: 4 }, 
      rarm_right:  { left: 40, top: 20, width: 4, height: 12 }, 
      rarm_front:  { left: 44, top: 20, width: 4, height: 12 },
      rarm_left:   { left: 48, top: 20, width: 4, height: 12 },
      rarm_back:   { left: 52, top: 20, width: 4, height: 12 },

      larm_top:    { left: 36, top: 48, width: 4, height: 4 }, 
      larm_bottom: { left: 40, top: 48, width: 4, height: 4 }, 
      larm_right:  { left: 32, top: 52, width: 4, height: 12 }, 
      larm_front:  { left: 36, top: 52, width: 4, height: 12 },
      larm_left:   { left: 40, top: 52, width: 4, height: 12 },
      larm_back:   { left: 44, top: 52, width: 4, height: 12 },
    },
    viewMappings: {
      body_top:    { left: 20, top: 0 },
      body_bottom: { left: 28, top: 0 },
      body_right:  { left: 16, top: 4 },
      body_front:  { left: 20, top: 4 },
      body_left:   { left: 28, top: 4 },
      body_back:   { left: 32, top: 4 },
      
      rarm_top:    { left: 4,  top: 0 },
      rarm_bottom: { left: 8,  top: 0 },
      rarm_right:  { left: 0,  top: 4 },
      rarm_front:  { left: 4,  top: 4 },
      rarm_left:   { left: 8,  top: 4 },
      rarm_back:   { left: 12, top: 4 },

      larm_top:    { left: 44, top: 0 },
      larm_bottom: { left: 48, top: 0 },
      larm_right:  { left: 40, top: 4 },
      larm_front:  { left: 44, top: 4 },
      larm_left:   { left: 48, top: 4 },
      larm_back:   { left: 52, top: 4 }
    }
  },
  lower_body: {
    width: 32,
    height: 16,
    planes: {
      rleg_top:    { left: 4,  top: 16, width: 4, height: 4 }, 
      rleg_bottom: { left: 8,  top: 16, width: 4, height: 4 }, 
      rleg_right:  { left: 0,  top: 20, width: 4, height: 12 }, 
      rleg_front:  { left: 4,  top: 20, width: 4, height: 12 },
      rleg_left:   { left: 8,  top: 20, width: 4, height: 12 },
      rleg_back:   { left: 12, top: 20, width: 4, height: 12 },

      lleg_top:    { left: 20, top: 48, width: 4, height: 4 }, 
      lleg_bottom: { left: 24, top: 48, width: 4, height: 4 }, 
      lleg_right:  { left: 16, top: 52, width: 4, height: 12 }, 
      lleg_front:  { left: 20, top: 52, width: 4, height: 12 },
      lleg_left:   { left: 24, top: 52, width: 4, height: 12 },
      lleg_back:   { left: 28, top: 52, width: 4, height: 12 }
    },
    viewMappings: {
      rleg_top:    { left: 4,  top: 0 },
      rleg_bottom: { left: 8,  top: 0 },
      rleg_right:  { left: 0,  top: 4 },
      rleg_front:  { left: 4,  top: 4 },
      rleg_left:   { left: 8,  top: 4 },
      rleg_back:   { left: 12, top: 4 },

      lleg_top:    { left: 20, top: 0 },
      lleg_bottom: { left: 24, top: 0 },
      lleg_right:  { left: 16, top: 4 },
      lleg_front:  { left: 20, top: 4 },
      lleg_left:   { left: 24, top: 4 },
      lleg_back:   { left: 28, top: 4 }
    }
  },
  head_wear: {
    width: 32,
    height: 16,
    planes: {
      top:    { left: 40, top: 0, width: 8, height: 8 },
      bottom: { left: 48, top: 0, width: 8, height: 8 },
      right:  { left: 32, top: 8, width: 8, height: 8 },
      front:  { left: 40, top: 8, width: 8, height: 8 },
      left:   { left: 48, top: 8, width: 8, height: 8 },
      back:   { left: 56, top: 8, width: 8, height: 8 }
    },
    viewMappings: {
      top:    { left: 8,  top: 0 },
      bottom: { left: 16, top: 0 },
      right:  { left: 0,  top: 8 },
      front:  { left: 8,  top: 8 },
      left:   { left: 16, top: 8 },
      back:   { left: 24, top: 8 }
    }
  },
  upper_body_wear: {
    width: 56,
    height: 16,
    planes: {
      body_top:    { left: 20, top: 32, width: 8, height: 4 },
      body_bottom: { left: 28, top: 32, width: 8, height: 4 },
      body_right:  { left: 16, top: 36, width: 4, height: 12 },
      body_front:  { left: 20, top: 36, width: 8, height: 12 },
      body_left:   { left: 28, top: 36, width: 4, height: 12 },
      body_back:   { left: 32, top: 36, width: 8, height: 12 },

      rarm_top:    { left: 44, top: 32, width: 4, height: 4 }, 
      rarm_bottom: { left: 48, top: 32, width: 4, height: 4 }, 
      rarm_right:  { left: 40, top: 36, width: 4, height: 12 }, 
      rarm_front:  { left: 44, top: 36, width: 4, height: 12 },
      rarm_left:   { left: 48, top: 36, width: 4, height: 12 },
      rarm_back:   { left: 52, top: 36, width: 4, height: 12 },

      larm_top:    { left: 52, top: 48, width: 4, height: 4 }, 
      larm_bottom: { left: 56, top: 48, width: 4, height: 4 }, 
      larm_right:  { left: 48, top: 52, width: 4, height: 12 }, 
      larm_front:  { left: 52, top: 52, width: 4, height: 12 },
      larm_left:   { left: 56, top: 52, width: 4, height: 12 },
      larm_back:   { left: 60, top: 52, width: 4, height: 12 },
    },
    viewMappings: {
      body_top:    { left: 20, top: 0 },
      body_bottom: { left: 28, top: 0 },
      body_right:  { left: 16, top: 4 },
      body_front:  { left: 20, top: 4 },
      body_left:   { left: 28, top: 4 },
      body_back:   { left: 32, top: 4 },
      
      rarm_top:    { left: 4,  top: 0 },
      rarm_bottom: { left: 8,  top: 0 },
      rarm_right:  { left: 0,  top: 4 },
      rarm_front:  { left: 4,  top: 4 },
      rarm_left:   { left: 8,  top: 4 },
      rarm_back:   { left: 12, top: 4 },

      larm_top:    { left: 44, top: 0 },
      larm_bottom: { left: 48, top: 0 },
      larm_right:  { left: 40, top: 4 },
      larm_front:  { left: 44, top: 4 },
      larm_left:   { left: 48, top: 4 },
      larm_back:   { left: 52, top: 4 }
    }
  },
  lower_body_wear: {
    width: 32,
    height: 16,
    planes: {
      rleg_top:    { left: 4,  top: 32, width: 4, height: 4 }, 
      rleg_bottom: { left: 8,  top: 32, width: 4, height: 4 }, 
      rleg_right:  { left: 0,  top: 36, width: 4, height: 12 }, 
      rleg_front:  { left: 4,  top: 36, width: 4, height: 12 },
      rleg_left:   { left: 8,  top: 36, width: 4, height: 12 },
      rleg_back:   { left: 12, top: 36, width: 4, height: 12 },

      lleg_top:    { left: 4,  top: 48, width: 4, height: 4 }, 
      lleg_bottom: { left: 8,  top: 48, width: 4, height: 4 }, 
      lleg_right:  { left: 0,  top: 52, width: 4, height: 12 }, 
      lleg_front:  { left: 4,  top: 52, width: 4, height: 12 },
      lleg_left:   { left: 8,  top: 52, width: 4, height: 12 },
      lleg_back:   { left: 12, top: 52, width: 4, height: 12 }
    },
    viewMappings: {
      rleg_top:    { left: 4,  top: 0 },
      rleg_bottom: { left: 8,  top: 0 },
      rleg_right:  { left: 0,  top: 4 },
      rleg_front:  { left: 4,  top: 4 },
      rleg_left:   { left: 8,  top: 4 },
      rleg_back:   { left: 12, top: 4 },

      lleg_top:    { left: 20, top: 0 },
      lleg_bottom: { left: 24, top: 0 },
      lleg_right:  { left: 16, top: 4 },
      lleg_front:  { left: 20, top: 4 },
      lleg_left:   { left: 24, top: 4 },
      lleg_back:   { left: 28, top: 4 }
    }
  },
};

const posToIndex = (x, y, w) => (x + y * w)

Object.keys(LayerSpecs).forEach((key) => {
  const spec = LayerSpecs[key];
  spec.viewToImageMapping = {};
  spec.imageToViewMapping = {};
  
  Object.keys(spec.planes).forEach((key) => {
    const plane   = spec.planes[key];
    const viewPos = spec.viewMappings[key];

    for(let y = 0; y < plane.height; y++) {
      for(let x = 0; x < plane.width; x++) {
        const viewIndex  = posToIndex(viewPos.left + x, viewPos.top + y, spec.width);
        const imageIndex = posToIndex(plane.left + x, plane.top + y, Skin.width);
        spec.viewToImageMapping[viewIndex] = imageIndex;
        spec.imageToViewMapping[imageIndex] = viewIndex;
      }
    }
  });
});

export default LayerSpecs;
