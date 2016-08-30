// Generated by CoffeeScript 1.10.0
(function() {
  var baguaImageEditor, between, dataURLToBlob, getStyleSheet, get_file_ext, int, isHTMLElement, max, min, px,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  baguaImageEditor = function(editor, opt, is_debug) {
    var $aspect_ratio_num, $crop_container, $cropped_img, $current_area, $current_corner, $current_img, $img_cropper, $img_dataurl, $img_editor, $options, $reisze_timer_id, $source_img, $touched, CROPPER, CROP_CORNER, EDITOR_ID, ORIENTATION, _eventListeners, _get_mimetype, _ratio, _ten, addListener, add_cropper_hanlders, add_default_styles, add_drag_corner_hanlders, blob, capture, capture_blob, debug, default_styles, destroy, init, last_area_height, last_area_width, load, loadedHook, methods, mimetype, mimetypes, now, pos_area, pos_cropper, pos_image, project_name, recipe, reload, removeAllListeners, removeListeners, resize_handler, scale, set_area, set_cropper, set_image, set_loaded_hook, unload, ver;
    project_name = 'BaguaImgEditor';
    ver = '0.4.2';
    now = Date.now();
    debug = false;
    mimetypes = {
      'image/png': ['png'],
      'image/jpeg': ['jpg', 'jpe', 'jpeg'],
      'image/gif': ['gif'],
      'image/bmp': ['bm', 'bmp']
    };
    default_styles = "*[bagua-image-editor] [cropper] { outline: 1px dotted #999; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; user-select: none; } *[bagua-image-editor] [cropper] [crop-corner] { border-radius: 50%; background: #999; }";
    $options = {
      corner_size: 12,
      crop_min_size: 32,
      cors: true
    };
    $reisze_timer_id = null;
    $aspect_ratio_num = 1;
    $source_img = null;
    $current_img = null;
    $current_corner = null;
    $current_area = null;
    $crop_container = null;
    $cropped_img = null;
    $img_editor = null;
    $img_cropper = null;
    $img_dataurl = null;
    $touched = false;
    EDITOR_ID = 'bagua-editor-id';
    CROP_CORNER = 'crop-corner';
    CROPPER = 'cropper';
    ORIENTATION = {
      'qian': {
        pos: [0, 0]
      },
      'kan': {
        pos: [0.5, 0]
      },
      'gen': {
        pos: [1, 0]
      },
      'zhen': {
        pos: [1, 0.5]
      },
      'xun': {
        pos: [1, 1]
      },
      'li': {
        pos: [0.5, 1]
      },
      'kun': {
        pos: [0, 1]
      },
      'dui': {
        pos: [0, 0.5]
      }
    };
    loadedHook = null;
    add_cropper_hanlders = function() {
      var area_height, area_left, area_top, area_width, dragging, dragstart, dragstop, start_x, start_y;
      start_x = null;
      start_y = null;
      area_left = 0;
      area_top = 0;
      area_width = 0;
      area_height = 0;
      dragstart = function(e) {
        if ($current_corner) {
          return;
        }
        start_y = e.clientY;
        start_x = e.clientX;
        area_left = parseInt($img_cropper.style.left) || 0;
        area_top = parseInt($img_cropper.style.top) || 0;
        area_width = parseInt($img_cropper.style.width);
        area_height = parseInt($img_cropper.style.height);
        addListener(document, 'mousemove', dragging);
        addListener(document, 'mouseup', dragstop);
        e.preventDefault();
        return e.stopPropagation();
      };
      dragging = function(e) {
        var new_bottom, new_left, new_right, new_top;
        new_top = max(area_top + e.clientY - start_y, 0);
        new_left = max(area_left + e.clientX - start_x, 0);
        new_right = max($current_area.clientWidth - new_left - area_width, 0);
        new_bottom = max($current_area.clientHeight - new_top - area_height, 0);
        if ((new_top + area_height) > $current_area.clientHeight) {
          new_top = $current_area.clientHeight - area_height;
        }
        if ((new_left + area_width) > $current_area.clientWidth) {
          new_left = $current_area.clientWidth - area_width;
        }
        $img_cropper.style.top = px(new_top);
        $img_cropper.style.left = px(new_left);
        $img_cropper.style.right = px(new_right);
        $img_cropper.style.bottom = px(new_bottom);
        pos_cropper();
        e.preventDefault();
        return e.stopPropagation();
      };
      dragstop = function(e) {
        $touched = true;
        document.removeEventListener('mousemove', dragging);
        document.removeEventListener('mouseup', dragstop);
        e.preventDefault();
        return e.stopPropagation();
      };
      addListener($img_cropper, 'mousedown', dragstart);
    };
    add_drag_corner_hanlders = function() {
      var area_bottom, area_left, area_right, area_top, corner, corners, dragging, dragstart, dragstop, j, len, limit_bottom, limit_left, limit_right, limit_top, max_height, max_width, start_x, start_y;
      start_x = null;
      start_y = null;
      area_left = 0;
      area_top = 0;
      area_bottom = 0;
      area_right = 0;
      limit_left = 0;
      limit_top = 0;
      limit_right = 0;
      limit_bottom = 0;
      max_width = 0;
      max_height = 0;
      dragstart = function(e) {
        var min_size;
        if (!e.target.hasAttribute(CROP_CORNER)) {
          return;
        }
        $current_corner = e.target;
        start_x = e.clientX;
        start_y = e.clientY;
        area_left = parseInt($img_cropper.style.left) || 0;
        area_top = parseInt($img_cropper.style.top) || 0;
        area_bottom = parseInt($img_cropper.style.bottom) || 0;
        area_right = parseInt($img_cropper.style.right) || 0;
        max_width = $current_area.clientWidth;
        max_height = $current_area.clientHeight;
        min_size = $options.crop_min_size;
        limit_left = max_width - area_right - min_size;
        limit_right = max_width - area_left - min_size;
        limit_top = max_height - area_bottom - min_size;
        limit_bottom = max_height - area_top - min_size;
        addListener(document, 'mousemove', dragging);
        addListener(document, 'mouseup', dragstop);
        e.preventDefault();
        return e.stopPropagation();
      };
      dragging = function(e) {
        var bottom, left, move_x, move_y, ori, right, top;
        if (!$img_cropper) {
          return;
        }
        move_x = e.clientX - start_x;
        move_y = e.clientY - start_y;
        ori = $current_corner.getAttribute(CROP_CORNER);
        top = null;
        left = null;
        right = null;
        bottom = null;
        if (ori === 'qian') {
          left = between(area_left + move_x, 0, limit_left);
          top = between(area_top + move_y, 0, limit_top);
        } else if (ori === 'kan') {
          top = between(area_top + move_y, 0, limit_top);
        } else if (ori === 'gen') {
          top = between(area_top + move_y, 0, limit_top);
          right = between(area_right - move_x, 0, limit_right);
        } else if (ori === 'zhen') {
          right = between(area_right - move_x, 0, limit_right);
        } else if (ori === 'xun') {
          right = between(area_right - move_x, 0, limit_right);
          bottom = between(area_bottom - move_y, 0, limit_bottom);
        } else if (ori === 'li') {
          bottom = between(area_bottom - move_y, 0, limit_bottom);
        } else if (ori === 'kun') {
          left = between(area_left + move_x, 0, limit_left);
          bottom = between(area_bottom - move_y, 0, limit_bottom);
        } else if (ori === 'dui') {
          left = between(area_left + move_x, 0, limit_left);
        }
        if (left !== null) {
          $img_cropper.style.left = px(left);
        }
        if (top !== null) {
          $img_cropper.style.top = px(top);
        }
        if (bottom !== null) {
          $img_cropper.style.bottom = px(bottom);
        }
        if (right !== null) {
          $img_cropper.style.right = px(right);
        }
        pos_cropper();
        e.preventDefault();
        return e.stopPropagation();
      };
      dragstop = function(e) {
        $current_corner = null;
        $touched = true;
        document.removeEventListener('mousemove', dragging);
        document.removeEventListener('mouseup', dragstop);
        e.preventDefault();
        return e.stopPropagation();
      };
      corners = $img_cropper.querySelectorAll('[' + CROP_CORNER + ']');
      for (j = 0, len = corners.length; j < len; j++) {
        corner = corners[j];
        addListener(corner, 'mousedown', dragstart);
      }
    };
    resize_handler = function(e) {
      pos_image();
      pos_area();
      return pos_cropper(true);
    };
    _eventListeners = [];
    addListener = function(node, event, handler, capture) {
      _eventListeners.push({
        node: node,
        event: event,
        hanlder: handler,
        capture: capture
      });
      node.addEventListener(event, handler, Boolean(capture));
    };
    removeListeners = function(node, event) {
      var idx, j, len, listener, remove_idxs;
      remove_idxs = [];
      for (idx = j = 0, len = _eventListeners.length; j < len; idx = ++j) {
        listener = _eventListeners[idx];
        if (event === listener.event && node === listener.node) {
          node.removeEventListener(event, listener.handler);
          remove_idxs.push(idx);
        }
      }
      _eventListeners.splice(remove_idxs, 1);
    };
    removeAllListeners = function() {
      var idx, j, len, listener;
      for (idx = j = 0, len = _eventListeners.length; j < len; idx = ++j) {
        listener = _eventListeners[idx];
        listener.node.removeEventListener(listener.event, listener.handler);
      }
      _eventListeners.length = 0;
    };
    add_default_styles = function() {
      var el_style;
      if (document.querySelector('style[bagua-style]')) {
        return;
      }
      el_style = document.createElement('style');
      el_style.innerHTML = default_styles;
      el_style.setAttribute('bagua-style', '');
      return document.head.insertBefore(el_style, document.head.firstChild);
    };
    set_image = function(img) {
      var current_img;
      current_img = img.cloneNode();
      current_img.style.maxWidth = '100%';
      current_img.style.maxHeight = '100%';
      current_img.style.position = 'relative';
      current_img.style.pointerEvents = 'none';
      $img_editor.appendChild(current_img);
      $current_img = current_img;
      pos_image();
      return current_img;
    };
    set_cropper = function(recipe) {
      var _crop_bottom, _crop_left, _crop_right, _crop_top, corner, crop_container, cropped_img, cropper, dim, index, ori;
      if (!$current_area || !$current_img) {
        throw project_name + ': Can not set copper before set area and img.';
        return;
      }
      if (recipe && typeof recipe === 'object') {
        if (recipe.crop && recipe.crop.ratio) {
          _crop_top = px($current_img.clientHeight * recipe.crop.ratio[0]);
          _crop_right = px($current_img.clientWidth * recipe.crop.ratio[1]);
          _crop_bottom = px($current_img.clientHeight * recipe.crop.ratio[2]);
          _crop_left = px($current_img.clientWidth * recipe.crop.ratio[3]);
        }
        if (recipe.aspect_ratio && recipe.aspect_ratio <= 1 && typeof recipe.aspect_ratio === 'number') {
          $aspect_ratio_num = recipe.aspect_ratio;
        }
      }
      cropper = document.createElement('DIV');
      cropper.style.position = 'absolute';
      cropper.style.top = _crop_top || 0;
      cropper.style.right = _crop_right || 0;
      cropper.style.bottom = _crop_bottom || 0;
      cropper.style.left = _crop_left || 0;
      cropper.style.zIndex = 99;
      cropper.setAttribute(CROPPER, now);
      cropper.classList.add(CROPPER);
      $current_area.appendChild(cropper);
      crop_container = document.createElement('DIV');
      crop_container.style.position = 'relative';
      crop_container.style.width = '100%';
      crop_container.style.height = '100%';
      crop_container.style.overflow = 'hidden';
      crop_container.style.pointerEvents = 'none';
      if (debug) {
        crop_container.style.background = 'orange';
      }
      $current_area.appendChild(crop_container);
      cropped_img = $current_img.cloneNode();
      cropped_img.style.maxWidth = null;
      cropped_img.style.maxHeight = null;
      cropped_img.style.position = 'absolute';
      cropped_img.style.top = 0;
      cropped_img.style.left = 0;
      crop_container.appendChild(cropped_img);
      index = 0;
      for (ori in ORIENTATION) {
        dim = ORIENTATION[ori];
        corner = document.createElement('DIV');
        corner.style.position = 'absolute';
        corner.style.width = px($options.corner_size);
        corner.style.height = px($options.corner_size);
        corner.style.cursor = 'pointer';
        corner.style.zIndex = 99 - index;
        if (debug) {
          corner.style.backgroundColor = 'blue';
        }
        corner.setAttribute(CROP_CORNER, ori);
        corner.classList.add(CROP_CORNER);
        cropper.appendChild(corner);
        index++;
      }
      $img_cropper = cropper;
      $cropped_img = cropped_img;
      $crop_container = crop_container;
      pos_cropper();
      add_drag_corner_hanlders();
      add_cropper_hanlders();
      return cropper;
    };
    set_area = function() {
      var area;
      if (!$current_img) {
        throw project_name + ': Can not set area before set current image.';
        return;
      }
      area = document.createElement('DIV');
      area.style.position = 'absolute';
      area.style.backgroundColor = 'rgba(0,0,0,0.5)';
      $img_editor.appendChild(area);
      $current_area = area;
      pos_area();
      return area;
    };
    pos_area = function() {
      if (!$current_img || !$current_area) {
        return;
      }
      $current_area.style.top = $current_img.style.top;
      $current_area.style.left = $current_img.style.left;
      $current_area.style.right = $current_img.style.left;
      $current_area.style.bottom = $current_img.style.top;
      $current_area.style.width = px($current_img.clientWidth);
      $current_area.style.height = px($current_img.clientHeight);
    };
    pos_image = function() {
      var editor_h, editor_w, img_h, img_w, p_h, p_w;
      if (!$current_img || !$source_img) {
        return;
      }
      editor_w = $img_editor.clientWidth;
      editor_h = $img_editor.clientHeight;
      if (!$current_img.width || !$current_img.height) {
        img_w = $source_img.width;
        img_h = $source_img.height;
        if (img_w > editor_w) {
          p_w = editor_w / img_w;
          img_w = editor_w;
          img_h = int(img_h * p_w);
        }
        if (img_h > editor_h) {
          p_h = editor_h / img_h;
          img_w = int(img_w * p_h);
          img_h = editor_h;
        }
        $current_img.width = img_w;
        $current_img.height = img_h;
      }
      $current_img.style.top = px((editor_h - $current_img.height) / 2);
      $current_img.style.left = px((editor_w - $current_img.width) / 2);
    };
    last_area_width = 0;
    last_area_height = 0;
    pos_cropper = function(resizing) {
      var area_height, area_width, bottom, corner, corner_offset, corners, dim, height, j, left, len, min_size, ori, percent_h, percent_w, right, top, width;
      if (!$current_area) {
        return;
      }
      corner_offset = int($options.corner_size / 2);
      corners = $img_cropper.querySelectorAll('[' + CROP_CORNER + ']');
      area_width = $current_area.clientWidth;
      area_height = $current_area.clientHeight;
      min_size = $options.crop_min_size;
      left = parseInt($img_cropper.style.left) || 0;
      right = parseInt($img_cropper.style.right) || 0;
      top = parseInt($img_cropper.style.top) || 0;
      bottom = parseInt($img_cropper.style.bottom) || 0;
      if (resizing && last_area_width && last_area_height) {
        percent_w = area_width / last_area_width;
        percent_h = area_height / last_area_height;
        left = between(int(left * percent_w), 0, area_width - min_size);
        right = between(int(right * percent_w), 0, area_width - min_size);
        top = between(int(top * percent_h), 0, area_height - min_size);
        bottom = between(int(bottom * percent_h), 0, area_height - min_size);
      }
      width = area_width - left - right;
      height = area_height - top - bottom;
      last_area_width = area_width;
      last_area_height = area_height;
      $img_cropper.style.top = px(top);
      $img_cropper.style.left = px(left);
      $img_cropper.style.right = px(right);
      $img_cropper.style.bottom = px(bottom);
      $img_cropper.style.width = px(width);
      $img_cropper.style.height = px(height);
      $crop_container.style.width = px(width);
      $crop_container.style.height = px(height);
      $crop_container.style.top = px(top);
      $crop_container.style.left = px(left);
      $cropped_img.style.top = px(-top);
      $cropped_img.style.left = px(-left);
      $cropped_img.width = $current_img.width;
      $cropped_img.height = $current_img.height;
      for (j = 0, len = corners.length; j < len; j++) {
        corner = corners[j];
        ori = corner.getAttribute(CROP_CORNER);
        dim = ORIENTATION[ori];
        corner.style.left = px(int(width * dim.pos[0]) - corner_offset);
        corner.style.top = px(int(height * dim.pos[1]) - corner_offset);
      }
    };
    _ratio = function(a, b) {
      if (b === 0) {
        return a;
      } else {
        return _ratio(b, a % b);
      }
    };
    _ten = function(a, b) {
      a = int(a);
      b = int(b);
      if (a < 100 && b < 100) {
        return [a, b];
      } else {
        a = a / 10;
        b = b / 10;
        return _ten(a, b);
      }
    };
    _get_mimetype = function(src) {
      var ext, k, v;
      ext = get_file_ext(src);
      if (ext) {
        for (k in mimetypes) {
          v = mimetypes[k];
          if (indexOf.call(v, ext) >= 0) {
            return k;
          }
        }
      }
      return null;
    };
    recipe = function() {
      var ca_bottom, ca_left, ca_right, ca_top, crop_h, crop_ratio, crop_w, crop_x, crop_y, height, percent, r, rh, rw, width;
      if (!$source_img || !$current_img) {
        return;
      }
      r = _ratio($source_img.width, $source_img.height);
      rw = int($source_img.width / r);
      rh = int($source_img.height / r);
      width = int($source_img.width * $aspect_ratio_num);
      height = int($source_img.height * $aspect_ratio_num);
      percent = width / $current_img.clientWidth;
      crop_w = int((parseInt($crop_container.style.width) || 0) * percent);
      crop_h = int((parseInt($crop_container.style.height) || 0) * percent);
      crop_x = int((parseInt($crop_container.style.left) || 0) * percent);
      crop_y = int((parseInt($crop_container.style.top) || 0) * percent);
      crop_w = min(crop_w, width);
      crop_h = min(crop_h, height);
      ca_top = parseInt($img_cropper.style.top);
      ca_right = parseInt($img_cropper.style.right);
      ca_bottom = parseInt($img_cropper.style.bottom);
      ca_left = parseInt($img_cropper.style.left);
      crop_ratio = [ca_top / $current_img.clientHeight, ca_right / $current_img.clientWidth, ca_bottom / $current_img.clientHeight, ca_left / $current_img.clientWidth];
      return {
        width: width,
        height: height,
        source: {
          w: $source_img.width,
          h: $source_img.height
        },
        crop: {
          w: crop_w,
          h: crop_h,
          x: crop_x,
          y: crop_y,
          ratio: crop_ratio
        },
        aspect_ratio: $aspect_ratio_num,
        rw: rw,
        rh: rh,
        pw: _ten(rw, rh)[0],
        ph: _ten(rw, rh)[1],
        modified: $touched
      };
    };
    scale = function(aspect_ratio_num) {
      if (!$source_img) {
        return;
      }
      aspect_ratio_num = Number(aspect_ratio_num);
      if ($aspect_ratio_num !== aspect_ratio_num) {
        $touched = true;
      }
      if (aspect_ratio_num && aspect_ratio_num <= 1) {
        $aspect_ratio_num = aspect_ratio_num;
      }
      return recipe();
    };
    mimetype = function() {
      if (!$source_img) {
        return;
      }
      return _get_mimetype($source_img.src);
    };
    capture = function(img_mimetype, encoder) {
      var canvas, canvas_context, img_crop, img_recipe, org_canvas, org_context;
      if (!$current_img) {
        return;
      }
      if (!img_mimetype) {
        img_mimetype = _get_mimetype($source_img.src);
      }
      img_recipe = recipe();
      org_canvas = document.createElement('canvas');
      org_canvas.width = img_recipe.width;
      org_canvas.height = img_recipe.height;
      org_context = org_canvas.getContext('2d');
      org_context.drawImage($source_img, 0, 0, img_recipe.width, img_recipe.height);
      img_crop = img_recipe.crop;
      canvas = document.createElement('canvas');
      canvas.width = img_crop.w;
      canvas.height = img_crop.h;
      canvas_context = canvas.getContext('2d');
      canvas_context.drawImage(org_canvas, img_crop.x, img_crop.y, img_crop.w, img_crop.h, 0, 0, img_crop.w, img_crop.h);
      $img_dataurl = canvas.toDataURL(img_mimetype, encoder);
      return $img_dataurl;
    };
    blob = function(media, dataurl) {
      var new_media;
      if (!$img_dataurl) {
        return;
      }
      if (!media || typeof media !== 'object') {
        media = {
          name: Date.now().toString(),
          lastModified: ''
        };
      }
      if (!dataurl) {
        dataurl = $img_dataurl;
      }
      new_media = dataURLToBlob(dataurl);
      new_media.name = media.name;
      new_media.lastModified = media.lastModified || document.lastModified;
      new_media.lastModifiedDate = new Date();
      return new_media;
    };
    capture_blob = function(media, encoder) {
      var dataurl;
      if (!$current_img) {
        return;
      }
      if (!media || typeof media !== 'object') {
        media = {};
      }
      dataurl = capture(media.type, encoder);
      return blob(media, dataurl);
    };
    destroy = function() {
      if (!$img_editor) {
        throw project_name + ': Image Editor not inited!';
      }
      console.log('---- Bagua Image Editor destroyed ----');
      unload();
      loadedHook = null;
      return $img_editor = null;
    };
    unload = function() {
      if ($img_editor && $current_img) {
        removeAllListeners();
        $img_editor.innerHTML = '';
        $reisze_timer_id = null;
        $source_img = null;
        $current_img = null;
        $current_corner = null;
        $current_area = null;
        $crop_container = null;
        $cropped_img = null;
        $img_cropper = null;
        $img_dataurl = null;
        return $touched = false;
      }
    };
    reload = function(img_src) {
      if (!img_src) {
        img_src = $source_img.src;
      }
      unload();
      return load(img_src);
    };
    load = function(img_src, recipe) {
      if (!$img_editor) {
        throw project_name + ': Image Editor can not load before inited!';
      }
      if (typeof img_src !== 'string' || !_get_mimetype(img_src)) {
        throw project_name + ': Invalid image!';
      }
      unload();
      $source_img = new Image();
      if ($options.cors) {
        $source_img.setAttribute('crossOrigin', 'anonymous');
      }
      $source_img.src = img_src;
      return $source_img.onload = function(e) {
        if (!$img_editor) {
          return;
        }
        set_image($source_img);
        set_area();
        set_cropper(recipe);
        if (typeof loadedHook === 'function') {
          return loadedHook();
        }
      };
    };
    set_loaded_hook = function(func) {
      if (typeof func === 'function') {
        return loadedHook = func;
      }
    };
    init = function(editor, opt, is_debug) {
      var k, v;
      if (typeof editor === 'string') {
        $img_editor = document.querySelector('[name=' + editor + ']');
      } else if (isHTMLElement(editor)) {
        $img_editor = editor;
      }
      if (!$img_editor) {
        throw project_name + ': Init image editor failed!!';
        return;
      }
      if (typeof opt === "object" && opt) {
        for (k in opt) {
          v = opt[k];
          $options[k] = v;
        }
      }
      debug = is_debug;
      $img_editor.setAttribute(EDITOR_ID, now);
      $img_editor.style.position = 'relative';
      if (debug) {
        $img_editor.style.background = 'yellow';
      }
      addListener(window, 'resize', resize_handler);
      add_default_styles();
      console.log('---- Bagua Image Editor inited ----');
      return console.log('version:', ver);
    };
    if (editor) {
      init(editor, opt, is_debug);
    }
    methods = {
      init: init,
      load: load,
      reload: reload,
      unload: unload,
      recipe: recipe,
      mimetype: mimetype,
      scale: scale,
      capture: capture,
      capture_blob: capture_blob,
      blob: blob,
      destroy: destroy,
      hooks: {
        loaded: set_loaded_hook
      }
    };
    return methods;
  };

  isHTMLElement = function(o) {
    var is_obj, is_obj_type, result;
    if (!o) {
      return false;
    }
    is_obj = o && typeof o === 'object' && o !== null;
    is_obj_type = o.nodeType === 1 && typeof o.nodeName === 'string';
    result = is_obj && is_obj_type;
    return result;
  };

  int = function(number, type) {
    var error;
    if (type === 'ceil' || type === 1) {
      return Math.ceil(number);
    } else if (type === 'floor' || type === -1) {
      return Math.floor(number);
    }
    try {
      return Math.round(number);
    } catch (error) {
      return parseInt(number) || 0;
    }
  };

  px = function(number) {
    if (typeof number === 'number') {
      return int(number) + 'px';
    } else {
      return number;
    }
  };

  max = function(number1, number2) {
    if (number1 > number2) {
      return number1;
    } else {
      return number2;
    }
  };

  min = function(number1, number2) {
    if (number1 < number2) {
      return number1;
    } else {
      return number2;
    }
  };

  between = function(number, min_number, max_number) {
    return min(max(number, min_number), max_number);
  };

  getStyleSheet = function(element, pseudo) {
    if (window.getComputedStyle) {
      return window.getComputedStyle(element, pseudo);
    }
    if (element.currentStyle) {
      return element.currentStyle;
    }
  };

  get_file_ext = function(str) {
    var error, ext, pair;
    try {
      str = str.split('?')[0].split('#')[0];
      if (str.substr(-1) === '/') {
        str = str.substr(0, str.length - 1);
      }
      pair = str.split('.');
      if (pair.length > 1) {
        ext = pair.pop();
        return ext.toLowerCase();
      }
      return '';
    } catch (error) {
      return '';
    }
  };

  dataURLToBlob = function(dataURL) {
    var BASE64_MARKER, contentType, i, parts, raw, rawLength, uInt8Array;
    BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      parts = dataURL.split(',');
      contentType = parts[0].split(':')[1];
      raw = parts[1];
      return new Blob([raw], {
        type: contentType
      });
    }
    parts = dataURL.split(BASE64_MARKER);
    contentType = parts[0].split(':')[1];
    raw = window.atob(parts[1]);
    rawLength = raw.length;
    uInt8Array = new Uint8Array(rawLength);
    i = 0;
    while (i < rawLength) {
      uInt8Array[i] = raw.charCodeAt(i);
      ++i;
    }
    return new Blob([uInt8Array], {
      type: contentType
    });
  };

  if (!window) {
    console.error(project_name + ': For browsers only!!');
  }

  if (window && !angular) {
    window.baguaImageEditor = baguaImageEditor;
  }

  angular.module('baguaImageEditor', []).directive('baguaImageEditor', [
    '$rootScope', function($rootScope) {
      return {
        restrict: 'EA',
        scope: {
          imgSrcUrl: '=',
          imgRecipe: '=',
          options: '='
        },
        link: function(scope, element, attrs) {
          var debug, img_editor, loaded;
          debug = attrs.debug || false;
          img_editor = new baguaImageEditor(element[0], scope.options, debug);
          loaded = false;
          if (scope.imgSrcUrl) {
            scope.$watch('imgSrcUrl', function(src) {
              if (src) {
                return img_editor.load(src, scope.imgRecipe);
              }
            });
          }
          img_editor.hooks.loaded(function() {
            var reload;
            if (loaded) {
              reload = true;
            } else {
              reload = false;
              loaded = true;
            }
            return $rootScope.$emit('bagua.loaded', img_editor, reload);
          });
          return scope.$on('$destroy', function() {
            if (img_editor) {
              return img_editor.destroy();
            }
          });
        }
      };
    }
  ]);

}).call(this);
