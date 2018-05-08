function hasClass(element, cls) {
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
var hidden_weight;
function processInput(data){
      data = data.replace("\n"," ")
      input = data.split(" ")
      result_number = parseInt(input[0]);
      layer = parseInt(input[1]);
      size = parseInt(input[2]);
      n_hidden = parseInt(input[3]);

      for(var i=4;i<input.length;i++){
        input[i] = toFloat(input[i])
      }

      //input
      var s = 4
      var e = s + size*size
      input_value = input.slice(s,e)

      // hidden_weight
      s = e
      e = s + size*size*n_hidden
      hidden_weight = input.slice(s,e)

      //hidden product
      s = e
      e = s + size*size*n_hidden
      hidden_product = input.slice(s,e)

      //hidden activation
      s = e
      e = s + n_hidden
      hidden = input.slice(s,e)

      //output_weight
      s = e
      e = s + n_hidden*10
      output_weight = input.slice(s,e)

      //output_weight
      s = e
      e = s + n_hidden*10
      output_product = input.slice(s,e)
      temp_output_product = input.slice(s,e)

      //output
      s = e
      e = s + 10
      output = input.slice(s,e)
      output2 = data.split(" ").slice(s,e)

      var max = 0.0
      for(var i=0;i<output2.length;i++){
        console.log(parseFloat(output2[i]))
        if(parseFloat(output2[i])>max){
          max = parseFloat(output2[i])
          result_number = i;
        }
      }
      console.log(max)
      console.log(result_number)


      /*
      console.log(input_value)
      console.log(hidden_weight)
      console.log(hidden_product)
      console.log(hidden)
      console.log(output_weight)
      console.log(output_product)
      console.log(output)
      */

      console.log(hidden_product)
      return [result_number,
              layer,
              size,
              n_hidden,
              input_value,
              hidden_weight,
              hidden_product,
              hidden,
              output_weight,
              output_product,
              output]
}
function set_buttons() {
      hidden_arr = new Array
      kkk = 0;
      var max = -100.0;
      for(var i=0;i<size;i++){
        for(var j=0;j<size;j++){
          for(var k=0;k<n_hidden;k++){
            var index = (k*size*size) + (size*i) + j
            hidden_arr.push(hidden_product[index])
            if(toFloat(hidden_product[index]) > max){
              max = toFloat(hidden_product[index])
              kkk=(k*size*size)+size*i+j;
            }
          }
        }
      }

      sort_hidden_arr = hidden_arr.sort(SortByFloat)

      hidden_threadhold = [
                      toFloat(sort_hidden_arr[0]),
                      toFloat(sort_hidden_arr[3]),
                      toFloat(sort_hidden_arr[10]),
                      0,
                      toFloat(sort_hidden_arr[sort_hidden_arr.length-11]),
                      toFloat(sort_hidden_arr[sort_hidden_arr.length-4]),
                      toFloat(sort_hidden_arr[sort_hidden_arr.length-1])];

      for(var i=0;i<hidden_threadhold.length-1;i++){
          $("#hidden_buttons").append('<span class="btn" onclick="draw_hidden_line('+hidden_threadhold[i]+','+hidden_threadhold[i+1]+','+i+')">'+hidden_threadhold[i]+'~'+hidden_threadhold[i+1]+'</span>')
      }

      output_arr = new Array
      for(var i=0;i<output_product.length;i++){
        output_arr[i] = output_product[i]
      }
      sort_output_arr = output_arr.sort(SortByFloat)

      output_threadhold = [
                      toFloat(sort_output_arr[0]),
                      toFloat(sort_output_arr[3]),
                      toFloat(sort_output_arr[10]),
                      0,
                      toFloat(sort_output_arr[sort_output_arr.length-11]),
                      toFloat(sort_output_arr[sort_output_arr.length-4]),
                      toFloat(sort_output_arr[sort_output_arr.length-1])];

      for(var i=0;i<output_threadhold.length-1;i++){
          $("#output_buttons").append('<span class="btn" onclick="draw_output_line('+output_threadhold[i]+','+output_threadhold[i+1]+','+i+')">'+output_threadhold[i]+'~'+output_threadhold[i+1]+'</span>')
      }
}
function toFloat(str){
  //return Math.ceil(parseFloat(str)*100000)/100000
  return parseInt(parseFloat(str)*1000)/1000
}
function toFloat2(str){
  return Math.ceil(parseFloat(str)*1000000000)/1000000000
}

var default_x = 0;
  //input
var default_y = 200;
var default_hidden_y = 200;
var default_output_y = 200;

var default_x = 100;
var default_hidden_visual_x = 1600;
var default_hidden_x = 3800;
var default_output_x = 4500;

var gap = 50;
var hidden_gap = 110
var output_gap = 150

var edge_type = "weight"
var edge_n = 0
var clicked_node = ""

$(function(){
  $("#header").append("<span style='left:"+default_x+"px'>Input Image, Value</span>")
  $("#header").append("<span style='left:"+default_hidden_visual_x+"px'>Hidden Node Visualization, Weight</span>")
  $("#header").append("<span style='left:"+(default_hidden_x-400)+"px'>Hidden Node Activation</span>")
  $("#header").append("<span style='left:"+default_output_x+"px'>Output Probability</span>")

  $(document).on("keyup",function(e){
    if(e.keyCode==72){
      toggle_hidden_text()
    }
    if(e.keyCode==80){
      toggle_hidden_product()
    }
    if(e.keyCode==73){
      toggle_input_text()
    }
    if(e.keyCode==84){
      toggle_hidden_to_output_type()
    }
  })

  set_image_number(0,true)
  for(var i=0;i<3;i++){
    $("#number_images").append(
      '<img src="/data/ori/vis'+i+'.png" alt="" onclick="set_image_number('+i+ ',true)"/>'
    )
    $("#number_images").append(
      '<img src="/data/ad/vis'+i+'.png" alt="" onclick="set_image_number('+i+',false)"/>'
    )
  }
})

function set_image_number(n, isOriginal) {
  var path = ""
  if(isOriginal){
    path = 'data/ori/'
  }else{
    path = 'data/ad/'
  }

  jQuery.get(path+'data'+n+'.txt', function(data) {
    $("#images img").attr("src", path+"vis"+n+".png")
    $(".hasSVG").text("")
    $(".hasSVG").removeClass("hasSVG")

    var input_arr = processInput(data)

    result_number = input_arr[0]
    layer = input_arr[1]
    size = input_arr[2]
    n_hidden = input_arr[3]

    input_value = input_arr[4]
    hidden_weight = input_arr[5]
    hidden_product = input_arr[6]
    hidden = input_arr[7]
    output_weight = input_arr[8]
    output_product = input_arr[9]
    output = input_arr[10]

    if(isOriginal){
      $("#number_images .text").text("Original " + n)
    }else{
      $("#number_images .text").text("Adversarial " + n + " => " + result_number )
    }
    set_buttons()

    $('#canvas').svg({onLoad: draw_node});
    $('#canvas svg').attr("height","5000")
    $('#canvas svg').attr("width","10000")

    hidden_product_without_zero = new Array
    hidden_product_without_zero[0] = new Array
    hidden_product_without_zero[1] = new Array

    for(var i=0;i<hidden_product.length;i++){
      if(hidden_product[i]>0.01){
        hidden_product_without_zero[0].push(hidden_product[i])
      }else if(hidden_product[i]<-0.01){
        hidden_product_without_zero[1].push(hidden_product[i])
      }
    }
    if(clicked_node=="hidden"){
      show_hidden_node(edge_n)
    }else if(clicked_node =="output"){
      show_output_node(edge_n)
    }

    show_hidden_node(0);
  })
}

  function input_node_text() {
    $("#input_node_text").svg(
      {onLoad: function(svg){
        //var line_g = svg.group({stroke: 'yellow', strokeWidth: 2}); //빨
        for(var i=0;i<size;i++){
          //svg.line(line_g, default_x-gap/2, default_y-gap/2+(i*gap), default_x-gap/2 + (size*gap), default_y-gap/2+(i*gap))
          //svg.line(line_g, default_x-gap/2 + (i*gap), default_y-gap/2, default_x-gap/2 +(i*gap), default_y-gap/2+ (size*gap))

          var input_gt = svg.group({fill:'green', stroke: 'green', strokeWidth: 1, fontSize: '32.5'}); 
          for(var j=0;j<size;j++){
            var value = input_value[size*i+j];
            if(value < 1 && value >= 0.01){
              svg.text(input_gt, default_x+j*gap-20, default_y+(i*gap)+5, value.toString().substring(1,4)) 
            } else if(value >= 1){
              svg.text(input_gt, default_x+j*gap-20, default_y+(i*gap)+5, ".99") 
            }
          }
        }
      }
    })
  }

  function draw_node(svg){
    var gt = svg.group({stroke: 'black', strokeWidth: 1, fontSize: '30'}); 
    var g = svg.group({stroke: 'black', strokeWidth: 2}); 
    input_node_text()

    //hidden node
    for(var i=0;i<n_hidden;i++){
      svg.circle(default_hidden_x, default_hidden_y + i * hidden_gap, 30, 
          {fill: 'white', stroke: 'green', strokeWidth: 3}); 

      var gbt = svg.group({stroke: 'black', strokeWidth: 1, fontSize: '70'}); 
      svg.text(gbt, default_hidden_x-230, default_hidden_y + 15 + i*hidden_gap, hidden[i].toString()); 

      $("#node_button").append(
          '<div class="btn-hidden-node" style="top:' + (default_hidden_y + i * hidden_gap-25) +'px;left:'+(default_hidden_x-25)+'px;" onclick="show_hidden_node('+i+')" node_number="'+i+'"><span style="font-size:60px">'+i+'</span>'+
          '</div>'
      )
    }

    for(var i=0;i<10;i++){
      if(i == result_number){
        svg.circle(default_output_x, default_output_y + i * output_gap, 50, 
            {fill: 'grey', stroke: 'grey', strokeWidth: 3}); 
      }else{
        svg.circle(default_output_x, default_output_y + i * output_gap, 50, 
            {fill: 'white', stroke: 'grey', strokeWidth: 3}); 
      }
      $("#node_button").append(
          '<div class="btn-output-node" style="top:' + (default_output_y + i * output_gap-50) +'px;left:'+(default_output_x-50)+'px;" onclick="show_output_node('+i+')" node_number="'+i+'"><span style="font-size:60px">'+i+'</span>'+
          '</div>'
      )

      var gbt = svg.group({stroke: 'black', strokeWidth: 1, fontSize: '70'}); 
      svg.text(gbt, default_output_x+60, default_output_y + 15 + i*output_gap, output[i].toString()); 
    }
  }

function show_output_node(n) {
  edge_n = n
  clicked_node = "output"

  $(".active-node").removeClass("active-node")
  $(".btn-output-node[node_number="+n+"]").addClass("active-node")

  draw_output_to_hidden_line(n,edge_type);
}

function draw_hidden_to_output_line(n, type){
  $("#output_line").text("")
  $("#output_line").removeClass("hasSVG")
  $("#output_line").svg(
    {onLoad: function(svg){
      var gbt = svg.group({stroke: 'black', strokeWidth: 1, fontSize: '100'}); 
      svg.text(gbt, (default_hidden_x+default_output_x)/2-100, (default_hidden_y + default_output_y)/2-50, type); 

      var data = new Array
      if(type=="product"){
        data = output_product
      }else if(type=="weight"){
        data = output_weight
      }

      var arr = new Array
      arr[0] = new Array
      arr[1] = new Array

      for(var i=0;i<data.length;i++){ 
        if(data[i] > 0.01)
          arr[0].push(data[i])
        else if(data[i] < -0.01)
          arr[1].push(data[i])
      }
      var mm = min_max(arr[0])
      var min = new Array
      var max = new Array
      min[0] = mm[0]
      max[0] = mm[1]

      mm = min_max(arr[1])
      min[1] = mm[1]
      max[1] = mm[0]

      var text_g = svg.group({color: 'red', strokeWidth: 2, fontSize:'50'});
      for(var i=0;i<10;i++){
        var index = n_hidden * i + n
        var product = output_product[index]
        var weight = output_weight[index]

        var d = 0.0
        if(type == "product"){
          d = product
        }else if(type == "weight"){
          d = weight
        }

        if(d > 0.0){
          var g = svg.group({stroke: 'red', strokeWidth: (d-min[0])/(max[0]-min[0])*30});
        }else{
          var g = svg.group({stroke: 'blue', strokeWidth: (d-min[1])/(max[1]-min[1])*30});
        }

        svg.line(g, default_hidden_x, default_hidden_y + n * hidden_gap, default_output_x, default_output_y + i * output_gap)

        svg.text(text_g, default_output_x+300, default_output_y + i * output_gap,
                "W : " + weight.toString()); 
        svg.text(text_g, default_output_x+300, default_output_y + 50 + i*output_gap,
                "P : " + product.toString()); 
      }
    }
  })
}
function draw_output_to_hidden_line(n, type){
  $("#output_line").text("")
  $("#output_line").removeClass("hasSVG")
  $("#output_line").svg(
    {onLoad: function(svg){
      var gbt = svg.group({stroke: 'black', strokeWidth: 1, fontSize: '100'}); 
      svg.text(gbt, (default_hidden_x+default_output_x)/2-100, (default_hidden_y + default_output_y)/2-50, type); 

      var data = new Array
      if(type=="product"){
        data = output_product
      }else if(type=="weight"){
        data = output_weight
      }

      var arr = new Array
      arr[0] = new Array
      arr[1] = new Array

      for(var i=0;i<data.length;i++){ 
        if(data[i] > 0.01)
          arr[0].push(data[i])
        else if(data[i] < -0.01)
          arr[1].push(data[i])
      }
      var mm = min_max(arr[0])
      var min = new Array
      var max = new Array
      min[0] = mm[0]
      max[0] = mm[1]

      mm = min_max(arr[1])
      min[1] = mm[1]
      max[1] = mm[0]

      var text_g = svg.group({color: 'red', strokeWidth: 2, fontSize:'50'});
      for(var i=0;i<n_hidden;i++){
        var index = n_hidden * n + i
        var product = output_product[index]
        var weight = output_weight[index]

        var d = 0.0
        if(type == "product"){
          d = product
        }else if(type == "weight"){
          d = weight
        }

        if(d > 0.0){
          var g = svg.group({stroke: 'red', strokeWidth: (d-min[0])/(max[0]-min[0])*30});
        }else{
          var g = svg.group({stroke: 'blue', strokeWidth: (d-min[1])/(max[1]-min[1])*30});
        }

        svg.line(g, default_hidden_x, default_hidden_y + i * hidden_gap, default_output_x, default_output_y + n * output_gap)

        svg.text(text_g, default_hidden_x-500, default_output_y + i * hidden_gap,
                "W : " + weight.toString()); 
        svg.text(text_g, default_hidden_x-500, default_output_y + 50 + i*hidden_gap,
                "P : " + product.toString()); 
      }
    }
  })
}
function hidden_node_image(node_number) {
  $("#hidden_node").text("")
  $("#hidden_node").removeClass("hasSVG")
  $(".active-node").removeClass("active-node")
  $(".btn-hidden-node[node_number="+node_number+"]").addClass("active-node")

  var hidden_node_weight = hidden_weight.slice(node_number*size*size, (node_number+1)*size*size)
  var hidden_node_product = hidden_product.slice(node_number*size*size, (node_number+1)*size*size)
  var hwmm = min_max(hidden_weight)
  var min = hwmm[0]
  var max = hwmm[1]
  var range = max-min
  var image_arr = new Array;
  var weight_arr = new Array;
  var product_arr = new Array;

  for(var i=0;i<hidden_node_weight.length;i++){
    var x = (hidden_node_weight[i]-min) / range
    var color = parseInt(x*255)
    var index_i = parseInt(i / size)
    var index_j = i % size
    if(index_j == 0){
      image_arr[index_i] = new Array
      weight_arr[index_i] = new Array
      product_arr[index_i] = new Array
    }
    image_arr[index_i][index_j] = color
    weight_arr[index_i][index_j] = hidden_node_weight[i]
    product_arr[index_i][index_j] = hidden_node_product[i]
  }


  var image_gap = 50
  $("#hidden_node").svg(
    {onLoad: function(svg){
      for(var i=0;i<size;i++){
        for(var j=0;j<size;j++){
        var color = "#"+image_arr[j][i].toString(16)+
                        image_arr[j][i].toString(16)+
                        image_arr[j][i].toString(16)

          svg.rect(default_hidden_visual_x+i*image_gap-image_gap/2, default_y+(j*image_gap)-image_gap/2, image_gap, image_gap,
                  {fill: color, strokeWidth: 0});

        }
      }

    }
  })

  $("#hidden_node_text").text("")
  $("#hidden_node_text").removeClass("hasSVG")
  $("#hidden_node_text").svg(
    {onLoad: function(svg){
      var text_g = svg.group({stroke: 'grey', strokeWidth: 1, fontSize: '32.5'}); 
      for(var i=0;i<size;i++){
        for(var j=0;j<size;j++){
          if(weight_arr[j][i]>=0.01){
            var str = weight_arr[j][i].toString().substring(1,4)
            svg.text(text_g, default_hidden_visual_x+(i*image_gap)-(image_gap/2)+10, default_y+(j*image_gap)-(image_gap/2)+25, str); 
          } else if(weight_arr[j][i]<=-0.01) {
            var str = "-" + weight_arr[j][i].toString().substring(2,5)
            svg.text(text_g, default_hidden_visual_x+(i*image_gap)-(image_gap/2), default_y+(j*image_gap)-(image_gap/2)+25, str); 
          }
        }
      }
    }
  })

  $("#hidden_product").text("")
  $("#hidden_product").removeClass("hasSVG")
  $("#hidden_product").svg(
    {onLoad: function(svg){
      min = new Array
      max = new Array

      var mm = min_max(hidden_product_without_zero[0])
      min[0] = mm[0]
      max[0] = mm[1]

      mm = min_max(hidden_product_without_zero[1])
      min[1] = mm[0]
      max[1] = mm[1]


      var image_gap = 50
      for(var i=0;i<size;i++){
        for(var j=0;j<size;j++){
          var color = ""
          if(product_arr[j][i] > 0.01){
            var x = parseInt(255-(product_arr[j][i]-min[0]) / (max[0]-min[0])*255).toString(16)
            if(x.length < 2)
              x="0"+x;
            color = '#ff'+x.toString(16)+'00'; //빨
          }else if(product_arr[j][i] < -0.01){
            var x = parseInt(Math.abs(product_arr[j][i]-min[1]) / (max[1]-min[1])*255).toString(16)
            if(x.length < 2)
              x="0"+x;

            color = '#00'+x+'ff'; //파 
          }

          if(color != ""){
            svg.rect(default_hidden_visual_x+i*image_gap-image_gap/2, default_y+(j*image_gap)-image_gap/2, image_gap, image_gap,
                    {fill: color, strokeWidth: 0});
            var text_g = svg.group({stroke: 'grey', strokeWidth: 1, fontSize: '30'}); 
            svg.text(text_g, default_hidden_visual_x+(i*image_gap)-(image_gap/2)+3, default_y+(j*image_gap)-(image_gap/2)+25, short_number(product_arr[j][i])); 

            svg.rect(default_x+i*image_gap-image_gap/2, default_y+(j*image_gap)-image_gap/2, image_gap, image_gap,
                    {fill: color, strokeWidth: 0});
            text_g = svg.group({stroke: 'grey', strokeWidth: 1, fontSize: '30'}); 
            svg.text(text_g, default_x+i*image_gap-image_gap/2+3, default_y+(j*image_gap)-image_gap/2+25, short_number(product_arr[j][i])); 
          }
        }
      }
    }
  })
}
function toggle_hidden_product(){
  if($("#hidden_product").hasClass("hide-svg")){
    $("#hidden_product").removeClass("hide-svg")
  }else{
    $("#hidden_product").addClass("hide-svg")
  }
}

function toggle_input_text(){
  if($("#input_node_text").hasClass("hide-svg")){
    $("#input_node_text").removeClass("hide-svg")
  }else{
    $("#input_node_text").addClass("hide-svg")
  }
}
function toggle_hidden_text(){
  if($("#hidden_node_text").hasClass("hide-svg")){
    $("#hidden_node_text").removeClass("hide-svg")
  }else{
    $("#hidden_node_text").addClass("hide-svg")
  }
}

function toggle_hidden_to_output_type(){
    if(edge_type == "weight"){
      edge_type ="product"
    }else if(edge_type == "product"){
      edge_type = "weight"
    }

    if(clicked_node == "hidden")
      draw_hidden_to_output_line(edge_n, edge_type)
    else if(clicked_node == "output")
      draw_output_to_hidden_line(edge_n, edge_type)
}

function show_hidden_node(n) {
  clicked_node="hidden"
  edge_n = n
  hidden_node_image(n)
  draw_hidden_to_output_line(n, edge_type)
}

function SortByFloat(a, b){
  var a_value = a;
  var b_value = b;
  if(a_value < b_value)
    return -1
  if(a_value > b_value)
    return 1
  return 0 
}
function min_max(data) {
    var max = -1000.0;
    var min = 1000.0;
    for(var i=0;i<data.length;i++){
      if(data[i] > max){
        max = data[i]
      }
      if(data[i] < min){
        min = data[i]
      }
    }
    return [min, max, max-min]
}


function standardDeviation(data){
  var avg = average(data);
  var squareDiffs = 0.0;
  for(var i=0;i<data.length;i++){
    var diff = data[i] - avg;
    var sqrDiff = diff * diff
    squareDiffs+=sqrDiff;
  }

  var dist = squareDiffs/data.length;
  var stdDev = Math.sqrt(dist);

  return toFloat(stdDev);
}

function average(data){
  var sum=0.0;
  for(var i=0;i<data.length;i++){
    sum+=data[i]
  }
  return toFloat(sum/data.length);
}
function short_number(data) {
  var str = ""
  if(data>0){
    str = data.toString().substring(1,4)
  } else {
    str = "-" + data.toString().substring(2,5)
  }
  return str
}

