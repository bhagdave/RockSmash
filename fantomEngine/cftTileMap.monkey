'#DOCON#
#rem
	Title:        fantomEngine
	Description:  A 2D game framework for the Monkey programming language
	
	Author:       Michael Hartlef
	Contact:      michaelhartlef@gmail.com
	
	Repository:   http://code.google.com/p/fantomengine/
	
	License:      MIT
#End


'nav:<blockquote><nav><b>fantomEngine documentation</b> | <a href="index.html">Home</a> | <a href="classes.html">Classes</a> | <a href="3rdpartytools.html">3rd party tools</a> | <a href="examples.html">Examples</a> | <a href="changes.html">Changes</a></nav></blockquote>

'header:The cftTileMap file provides the ftMapObj class that holds datas from map objects.


Import fantomEngine

'#DOCOFF#
'***************************************
Class ftMapTile
	Field tileID:Int
	Field column:Int
	Field row:Int
	Field sizeX:Int
	Field sizeY:Int
	Field xOff:Float
	Field yOff:Float
End

'#DOCON#
'***************************************
'changes:New in version 1.51.
#Rem
'summery:The ftMapObj class stores and deals with map objects provided by a Tiled compatible map.
The content of each object is only defined by the content of the map. So for an example, the object type
can be set by the map creator and you have to make sure that your app acts accordingly.
#End
Class ftMapObj
'#DOCOFF#
	Field layerName:String
	Field name:String
	Field type:String
	
	Field x:Float
	Field y:Float
	Field width:Float
	Field height:Float
	Field isVisible:Bool
	Field alpha:Float
	Field polyline:Float[]
	Field polygon:Float[]
'#DOCON#
	Field properties:StringMap<String> = Null
	'-----------------------------------------------------------------------------
'summery:Get the alpha value of a map object.
	Method GetAlpha:Float()
		Return Self.alpha
	End 
	'-----------------------------------------------------------------------------
'summery:Get the height of a map object.
	Method GetHeight:Float()
		Return Self.height
	End 
	'-----------------------------------------------------------------------------
'summery:Returns the name of the map layer, NOT the ftLayer.
	Method GetLayerName:String ()
		Return Self.layerName
	End	
	'-----------------------------------------------------------------------------
'summery:Returns the name of map object.
	Method GetName:String ()
		Return Self.name
	End	
	'-----------------------------------------------------------------------------
'summery:Returns the polygon of a map object.
	Method GetPolygon:Float[]()
		Return Self.polygon		
	End
	'-----------------------------------------------------------------------------
'summery:Returns the polyline of a map object.
	Method GetPolyLine:Float[]()
		Return Self.polyline		
	End
	'-----------------------------------------------------------------------------
'summery:Returns the objects X and Y position in a 2D Float array. This is NOT the position of the ftObject.
	Method GetPos:Float[]()
		Local p:Float[2]
		p[0] = Self.x
	    p[1] = Self.y
		Return p		
	End
	'-----------------------------------------------------------------------------
'summery:Get the X position of a map object. This is NOT the position of the ftObject.
	Method GetPosX:Float()
		Return Self.x
	End 
	'-----------------------------------------------------------------------------
'summery:Get the Y position. This is NOT the position of the ftObject.
	Method GetPosY:Float()
		Return Self.y
	End 
	'-----------------------------------------------------------------------------
'summery:Get the value of a specific property of a map object.
	Method GetProperty:String(key:String)
		Return Self.properties.Get(key)
	End 
	'-----------------------------------------------------------------------------
'summery:Get number of properties of a map object.
	Method GetPropertyCount:Int()
		Return Self.properties.Count()
	End 
	'-----------------------------------------------------------------------------
'summery:Returns the type of map object.
	Method GetType:String ()
		Return Self.type
	End	
	'-----------------------------------------------------------------------------
'summery:Get the visible flag of a map object.
	Method GetVisible:Bool()
		Return Self.isVisible
	End 
	'-----------------------------------------------------------------------------
'summery:Get the width of a map object.
	Method GetWidth:Float()
		Return Self.width
	End 
End


#rem
footer:This fantomEngine framework is released under the MIT license:
[quote]Copyright (c) 2011-2013 Michael Hartlef

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, and to permit persons to whom the software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
[/quote]
#end