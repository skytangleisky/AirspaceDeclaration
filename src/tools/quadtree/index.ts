export interface Rect{
  x:number
  y:number
  width:number
  height:number
}
export default class Quadtree{
  bounds:Rect
  max_objects:number
  max_levels:number
  level:number
  objects:Array<Rect>
  nodes:Array<Quadtree>
  constructor(bounds:Rect, max_objects:number|undefined=10, max_levels:number|undefined=4, level:number|undefined=0){
    this.bounds = bounds
    this.max_objects = max_objects
    this.max_levels = max_levels
    this.level = level
    this.objects    = [];
    this.nodes      = [];
  }
  /**
   * Split the node into 4 subnodes
   * @memberof Quadtree
   */
  split(){
    var nextLevel   = this.level + 1,
    subWidth    = this.bounds.width/2,
    subHeight   = this.bounds.height/2,
    x           = this.bounds.x,
    y           = this.bounds.y;
    //top right node
    this.nodes[0] = new Quadtree({
      x       : x + subWidth,
      y       : y,
      width   : subWidth,
      height  : subHeight
    }, this.max_objects, this.max_levels, nextLevel);
    //top left node
    this.nodes[1] = new Quadtree({
      x       : x,
      y       : y,
      width   : subWidth,
      height  : subHeight
    }, this.max_objects, this.max_levels, nextLevel);
    //bottom left node
    this.nodes[2] = new Quadtree({
      x       : x,
      y       : y + subHeight,
      width   : subWidth,
      height  : subHeight
    }, this.max_objects, this.max_levels, nextLevel);
    //bottom right node
    this.nodes[3] = new Quadtree({
      x       : x + subWidth,
      y       : y + subHeight,
      width   : subWidth,
      height  : subHeight
    }, this.max_objects, this.max_levels, nextLevel);
  }
  /**
   * Determine which node the object belongs to
   * @param {Rect} pRect      bounds of the area to be checked ({ x, y, width, height })
   * @return {number[]}       an array of indexes of the intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right / ne, nw, sw, se)
   * @memberof Quadtree
   */
  getIndex(pRect:Rect):Array<number> {
    var indexes = [],
      horizontalMidpoint    = this.bounds.x + (this.bounds.width/2),
      verticalMidpoint  = this.bounds.y + (this.bounds.height/2);
    var startIsNorth = pRect.y < verticalMidpoint,
      startIsWest  = pRect.x < horizontalMidpoint,
      endIsEast    = pRect.x + pRect.width > horizontalMidpoint,
      endIsSouth   = pRect.y + pRect.height > verticalMidpoint;
    //top-right quad
    if(startIsNorth && endIsEast) {
      indexes.push(0);
    }
    //top-left quad
    if(startIsWest && startIsNorth) {
      indexes.push(1);
    }
    //bottom-left quad
    if(startIsWest && endIsSouth) {
      indexes.push(2);
    }
    //bottom-right quad
    if(endIsEast && endIsSouth) {
      indexes.push(3);
    }
    return indexes;
  }
  /**
   * Insert the object into the node. If the node
   * exceeds the capacity, it will split and add all
   * objects to their corresponding subnodes.
   * @param {Rect} pRect      bounds of the object to be added ({ x, y, width, height })
   * @memberof Quadtree
   */
  insert(pRect:Rect) {
    var i = 0,
      indexes;
    //if we have subnodes, call insert on matching subnodes
    if(this.nodes.length) {
      indexes = this.getIndex(pRect);
      for(i=0; i<indexes.length; i++) {
        this.nodes[indexes[i]].insert(pRect);
      }
      return;
    }
    //otherwise, store object here
    this.objects.push(pRect);
    //max_objects reached
    if(this.objects.length > this.max_objects && this.level < this.max_levels) {
      //split if we don't already have subnodes
      if(!this.nodes.length) {
        this.split();
      }
      //add all objects to their corresponding subnode
      for(i=0; i<this.objects.length; i++) {
        indexes = this.getIndex(this.objects[i]);
        for(var k=0; k<indexes.length; k++) {
          this.nodes[indexes[k]].insert(this.objects[i]);
        }
      }
      //clean up this node
      this.objects = [];
    }
  }
  /**
   * Return all objects that could collide with the given object
   * @param {Rect} pRect      bounds of the object to be checked ({ x, y, width, height })
   * @return {Rect[]}         array with all detected objects
   * @memberof Quadtree
   */
  retrieve(pRect:Rect):Array<Rect> {
    var indexes = this.getIndex(pRect),
      returnObjects = this.objects;
    //if we have subnodes, retrieve their objects
    if(this.nodes.length) {
      for(var i=0; i<indexes.length; i++) {
        returnObjects = returnObjects.concat(this.nodes[indexes[i]].retrieve(pRect));
      }
    }
    //remove duplicates
    returnObjects = returnObjects.filter(function(item, index) {
      return returnObjects.indexOf(item) >= index;
    });
    return returnObjects;
  }
  /**
   * Clear the quadtree
   * @memberof Quadtree
   */
  clear() {
    this.objects = [];
    for(var i=0; i < this.nodes.length; i++) {
      if(this.nodes.length) {
        this.nodes[i].clear();
      }
    }
    this.nodes = [];
  }
}