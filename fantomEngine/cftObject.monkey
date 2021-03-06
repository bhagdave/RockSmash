#rem
	Title:        fantomEngine
	Description:  A 2D game framework for the Monkey programming language
	
	Author:       Michael Hartlef
	Contact:      michaelhartlef@gmail.com
	
	Repository:   http://code.google.com/p/fantomengine/
	
	License:      MIT
#End

Import fantomEngine

'nav:<blockquote><nav><b>fantomEngine documentation</b> | <a href="index.html">Home</a> | <a href="classes.html">Classes</a> | <a href="3rdpartytools.html">3rd party tools</a> | <a href="examples.html">Examples</a> | <a href="changes.html">Changes</a></nav></blockquote>
#Rem
'header:The class [b]ftObject[/b] offers you a huge set of methods to deal with its object. And object can either be an (animated) image, a bitmap font text, a tile map, a primitive (circle, rectangle) or a zone (circle, rectangle). 
#End
'***************************************
Class ftObject
'#DOCOFF#
	Field xPos:Float = 0.0
	Field yPos:Float = 0.0
	Field zPos:Float = 0.0
	Field w:Float = 0.0
	Field h:Float = 0.0

'**---------------------------------------------------------------------------------------------------------------------------------------**
	Field x2:Float = 0.0								'Render -- case ftEngine.otLine
	Field y2:Float = 0.0								'Render -- case ftEngine.otLine
	'Field verts:Float[] = [0.0,0.0, 0.0,0.0, 0.0,0.0]	'Render -- case ftEngine.otPoly (Polygon requires minimum of 3 x,y pairs)
	Field verts:Float[]
'**---------------------------------------------------------------------------------------------------------------------------------------**


	Field rw:Float = 0.0
	Field rh:Float = 0.0
	Field rox:Float = 0.0
	Field roy:Float = 0.0
	
	Field angle:Float = 0.0
	Field scaleX:Float = 1.0
	Field scaleY:Float = 1.0
	Field radius:Float = 1.0
	Field friction:Float = 0.0
	
	Field speed:Float = 0.0
	Field speedX:Float = 0.0
	Field speedY:Float = 0.0
	Field speedSpin:Float = 0.0
	Field speedAngle:Float = 0.0
	Field speedMax:Float = 9999.0
	Field speedMin:Float = -9999.0
	
	Field engine:ftEngine = Null
	
	Field red:Float   = 255.0
	Field blue:Float  = 255.0
	Field green:Float = 255.0
	Field alpha:Float = 1.0
	Field blendMode:Int = 0 
	
	Field objImg:ftImage
	
	Field animTime:Float = 0.0
	Field frameCount:Float = 1
	Field frameStart:Float = 0
	Field frameEnd:Float = 0
	Field frameTime:Float = 10
	Field frameLength:Float = 0
	
	Field layer:ftLayer = Null
	Field layerNode:list.Node<ftObject> = Null     'Version 1.21
	
	Field parentObj:ftObject = Null
	Field parentNode:list.Node<ftObject> = Null     'Version 1.21
	
 	Field timerList := New List<ftTimer>
	Field childObjList := New List<ftObject>
	Field transitionList := New List<ftTrans>

	Field marker:ftMarker = Null
	Field markerNode:list.Node<ftObject> = Null
	
	
	Field objFont:ftFont = Null
	
	Field id:Int = 0
	Field textMode:Int = 0
	Field name:String = ""
	Field text:String = ""
	Field tag:Int = 0
	Field type:Int = ftEngine.otImage
	Field groupID:Int = 0
	
	Field collType:Int = 0
	Field collScale:Float = 1.0
	Field collGroup:Int = 0
	Field collWith:Int[] = [0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0]
	Field colCheck:Bool = False
	
	Field isVisible:Bool = True
	Field isAnimated:Bool = False
	Field isActive:Bool = True
	Field isWrappingX:Bool = False
	Field isWrappingY:Bool = False
	Field touchMode:Int = 0
	Field isFlipH:Bool = False    'Up/Down     =Y
	Field isFlipV:Bool = False    'Left/Right  =X

	Field onDeleteEvent:Bool = False
	Field onRenderEvent:Bool = False
	Field onUpdateEvent:Bool = True
	
	Field x1c:Float = 0.0
	Field y1c:Float = 0.0
	Field x2c:Float = 0.0
	Field y2c:Float = 0.0
	Field x3c:Float = 0.0
	Field y3c:Float = 0.0
	Field x4c:Float = 0.0
	Field y4c:Float = 0.0

	Field deleted:Bool = False
	
	Field tileMap:ftMapTile[]
	Field tileCount:Int = 0
	Field tileCountX:Int = 0
	Field tileCountY:Int = 0
	Field tileSizeX:Int = 0
	Field tileSizeY:Int = 0
	Field tileModSX:Float = 0.0
	Field tileModSY:Float = 0.0
	Field mapObjList := New List<ftMapObj>
	Field dataObj:Object = Null
	Field box2DBody:Object = Null
	
	Field objPathUpdAngle:Bool = False
	
	Field offAngle:Float = 0.0
	Field handleX:Float = 0.5
	Field handleY:Float = 0.5
	Field hOffX:Float = 0.0
	Field hOffY:Float = 0.0
	
'#DOCON#	
	'-----------------------------------------------------------------------------
#Rem
'summery:Activates the ftEngine.OnObjectDelete method to be called for an object when it will be removed through the Remove method with the direct flag.
'By default this flag is set OFF.
#End
	Method ActivateDeleteEvent:Void (onOff:Bool = True )
		Self.onDeleteEvent = onOff
	End	
	'-----------------------------------------------------------------------------
#Rem
'summery:Activates the ftEngine.OnObjectRender method to be called for a visible object during the execution of the ftEngine.Render() method.
'By default this flag is set OFF.
#End
	Method ActivateRenderEvent:Void (onOff:Bool = True )
		Self.onRenderEvent = onOff
	End	
	'-----------------------------------------------------------------------------
#Rem
'summery:Activates the ftEngine.OnObjectUpdate? method to be called for an active object during ftEngine.Update.
'By default this flag is set ON.
#End
	Method ActivateUpdateEvent:Void (onOff:Bool = True )
		Self.onUpdateEvent = onOff
	End	
	'-----------------------------------------------------------------------------
'summery:Adds speed to the object. If an angle is given, the speed will be added in that direction. If not, then in the objects angle.
	Method AddSpeed:Void (sp:Float, ang:Float=9876.5)
	    Local a:Float
		
	    If ang = 9876.5 Then
	        a = angle
	    Else
	        a = ang
	    Endif

	    speedX = speedX + Sin(a) * sp
	    speedY = speedY - Cos(a) * sp
	
	    a= ATan2( speedY, speedX )+90.0
	    If a < 0.0 Then
	        a = a + 360.0
	    Else
	        If a > 360.0 Then
			    a = a - 360.0
	        Endif
	    Endif
	    speedAngle = a 
	    speed = Sqrt(speedX * speedX + speedY * speedY)
		If speed > speedMax Then speed = speedMax
	End
	'-----------------------------------------------------------------------------
'summery:Add an alpha transition to an existing transition.
	Method AddTransAlpha:Void(trans:ftTrans, alpha:Float, relative:Int)
		trans.AddAlpha(alpha,Self,trans.duration, relative)
	End
	'-----------------------------------------------------------------------------
'summery:Add a position transition to an existing transition.
	Method AddTransPos:Void(trans:ftTrans, xt:Float, yt:Float, relative:Int)
		trans.AddPos(xt, yt, Self, trans.duration, relative)
	End
	'-----------------------------------------------------------------------------
'summery:Add a rotation transition to an existing transition.
	Method AddTransRot:Void(trans:ftTrans, rot:Float, relative:Int)
		trans.AddRot(rot, Self, trans.duration, relative)
	End
	'-----------------------------------------------------------------------------
'summery:Add a scaling transition to an existing transition.
	Method AddTransScale:Void(trans:ftTrans, sca:Float, relative:Int)
		trans.AddScale(sca, Self, trans.duration, relative)
	End
	'-----------------------------------------------------------------------------
'summery:Cancels all timers attached to an object.
	Method CancelTimerAll:Void()
		For Local timer := Eachin timerList 
			timer.RemoveTimer()
		Next
	End
	'-----------------------------------------------------------------------------
'summery:Cancels all transitions attached to an object.
	Method CancelTransAll:Void()
		For Local trans := Eachin transitionList    
			trans.Cancel()
		Next
	End
	'-----------------------------------------------------------------------------
'changes:Changed in version 1.51. Supports now collisions against a line object (collision type ctLine)	
#Rem
'summery:Check if a collision has happened for this object.
The following collision types are valid at the moment:
[list]ftEngine.ctCircle   (Value = 0)
ftEngine.ctBox%   (Value = 1 -> rotated bounding box)
ftEngine.ctBound   (Value = 2 -> nonrotated bounding box)
ftEngine.ctLine   (Value = 3)[/list]
#End
	Method CheckCollision:Bool(sp2:ftObject)
		If sp2.deleted = False And Self.deleted = False Then
			If sp2.collGroup > 0 And sp2.isActive Then
				If (Self.collWith[(sp2.collGroup-1)]>0) Then
					Select Self.collType
						Case ftEngine.ctCircle
							Select sp2.collType  
								Case ftEngine.ctLine
									Return internal_Circle2LineObj(self, sp2)
								Case ftEngine.ctBox, ftEngine.ctBound
									Return internal_Circle2Box(Self, sp2)
								Default
									Return internal_Circle2Circle(Self, sp2)
							End
						Case ftEngine.ctBox
							Select sp2.collType  
								Case ftEngine.ctCircle
									Return internal_Box2Circle(Self, sp2)
									'Return internal_Circle2Box(sp2,Self)
								Default
									Return internal_Box2Box(Self, sp2)
							End
						Case ftEngine.ctBound
							Select sp2.collType  
								Case ftEngine.ctCircle
									Return internal_Box2Circle(Self, sp2)
								Case ftEngine.ctBox, ftEngine.ctLine
									Return internal_Box2Box(Self, sp2)
								Default
									Return internal_Bound2Bound(Self, sp2)
							End
						Case ftEngine.ctLine
							Select sp2.collType  
								Case ftEngine.ctCircle
									Return internal_Circle2LineObj(sp2, self)
								Default
									Return internal_Box2Box(Self, sp2)
							End
						Default
							Return internal_Circle2Circle(Self, sp2)
					End
				Endif
			Endif
		Endif
		Return False
	End
	'-----------------------------------------------------------------------------
'changes:Changed in version 1.51. Touchmode = 3 (tmBox) checks against the rotated box now.
#Rem
'summery:Check if a touch has happened.
The following touch types are valid at the moment:
[list]ftEngine.tmCircle   (Value = 1)
ftEngine.tmBound   (Value = 2)
ftEngine.tmBox   (Value = 3)[/list]
#End
	Method CheckTouchHit:Bool(px:Float, py:Float)
		Local txOff:Float = 0.0
		Local tyOff:Float = 0.0
		Local ret:Bool = False
'Print ("touchMode="+Self.touchMode+"     xy="+px+":"+py)	
		If deleted = False Then
			Select type

				Case ftEngine.otText
					Select textMode
						Case 0   'taTopLeft
							txOff = -(Float(Self.objFont.Length(Self.text))/2.0)*Self.scaleX
							tyOff = (Self.objFont.lineHeight/2.0*Self.scaleY)
							
				     	Case 1   'taTopCenter
							txOff = 0.0
							tyOff = (Self.objFont.lineHeight/2.0*Self.scaleY)
							
						Case 2   'taTopRight
							txOff = (Float(Self.objFont.Length(Self.text))/2.0)*Self.scaleX
							tyOff = (Self.objFont.lineHeight/2.0*Self.scaleY)
						
						Case 7   'taCenterLeft
							txOff = -(Float(Self.objFont.Length(Self.text))/2.0)*Self.scaleX
							tyOff = 0.0
							
				     	Case 3   'taCenterCenter
							txOff = 0.0
							tyOff = 0.0
							
						Case 4   'taCenterRight
							txOff = (Float(Self.objFont.Length(Self.text))/2.0)*Self.scaleX
							tyOff = 0.0
														
						Case 8   'taBottomLeft
							txOff = -(Float(Self.objFont.Length(Self.text))/2.0)*Self.scaleX
							tyOff = -(Self.objFont.lineHeight/2.0*Self.scaleY)
							
				     	Case 5   'taBottomCenter
							txOff = 0.0
							tyOff = -(Self.objFont.lineHeight/2.0*Self.scaleY)
							
						Case 6   'taBottomRight
							txOff = (Float(Self.objFont.Length(Self.text))/2.0)*Self.scaleX
							tyOff = -(Self.objFont.lineHeight/2.0*Self.scaleY)
						
					End
					
					Select Self.touchMode
				     	Case ftEngine.tmCircle
							ret = internal_PointInsideCircle(Self, px+txOff, py-tyOff)
							'ret = internal_PointInsidePolygon(Self, px+txOff, py-tyOff)
						Case ftEngine.tmBound
							ret = internal_PointInsideBound(Self, px+txOff, py-tyOff)
						Case ftEngine.tmBox
							ret = internal_PointInsidePolygon(Self, px+txOff, py-tyOff)
					End
				Default
					Select Self.touchMode
				     	Case ftEngine.tmCircle
							ret = internal_PointInsideCircle(Self, px, py)
							'ret = internal_PointInsidePolygon(Self, px, py)
						Case ftEngine.tmBound
							ret = internal_PointInsideBound(Self, px, py)
						Case ftEngine.tmBox
							ret = internal_PointInsidePolygon(Self, px+txOff, py-tyOff)
					End
			End
		Endif

		Return ret
	End
'#DOCOFF#	
	'-----------------------------------------------------------------------------
	Method CleanupLists:Void()
		Local a:String
		For Local trans:ftTrans = Eachin Self.transitionList
			If trans.deleted Then trans.Cancel()
		Next

		For Local timer:ftTimer = Eachin Self.timerList
'Bug fix to prevent Error:1023 Stack overflow
	#If TARGET = "flash" Then
		 	XWA(0)
	#End
			If timer.deleted Then timer.RemoveTimer()
		Next
	End
'#DOCON#
	'-----------------------------------------------------------------------------
#Rem
'summery:Create a timer for this object. 
'A repeatCount of -1 will let the timer run forever. The duration is the time in milliseconds, after which the [b]ftEngine.OnObjectTimer[/b] method is called.
#End
	Method CreateTimer:ftTimer(timerID:Int, duration:Int, repeatCount:Int = 0 )
		Local timer:ftTimer = New ftTimer
		timer.engine = Self.engine
		'timer.startTime = Self.engine.time
		timer.currTime = Self.engine.time
		'timer.endTime = timer.startTime + duration
		timer.duration = duration
		timer.id = timerID
'Print ("Create id="+timer.id)		
		timer.intervall = duration
		timer.loop = repeatCount
		timer.obj = Self
		timer.timerNode = self.timerList.AddLast(timer)
		Return timer
	End
	'-----------------------------------------------------------------------------
#Rem
'summery:Create an alpha transition.
'The duration is the time in milliseconds, the transition takes to complete. Only a transID > 0 will fire the [b]ftEngine.OnObjectTrans[/b] method.
#End
	Method CreateTransAlpha:ftTrans(transAlpha:Float, duration:Float, relative:Int, transId:Int=0 )
		Local trans:ftTrans = New ftTrans
		trans.engine = Self.engine
		trans.obj = Self
		trans.layer = Null
		
		'trans.startTime = Self.engine.time
		'trans.currTime = trans.startTime
		trans.currTime = Self.engine.time
		'trans.lastTime = trans.startTime
		'trans.endTime = trans.startTime + duration
		trans.finishID = transId
		trans.duration = duration
		trans.AddAlpha(transAlpha,Self,duration, relative)
		
		trans.transNode = Self.transitionList.AddLast(trans)
		Return trans
	End
	'-----------------------------------------------------------------------------
#Rem
'summery:Create a position transition.
'The duration is the time in milliseconds, the transition takes to complete. Only a transID > 0 will fire the [b]ftEngine.OnObjectTrans[/b] method.
#End
	Method CreateTransPos:ftTrans(xt:Float, yt:Float, duration:Float, relative:Int, transId:Int=0 )
		Local trans:ftTrans = New ftTrans
		trans.engine = Self.engine
		trans.obj = Self
		trans.layer = Null
		
		'trans.startTime = Self.engine.time
		'trans.currTime = trans.startTime
		trans.currTime = Self.engine.time
		'trans.lastTime = trans.startTime
		'trans.endTime = trans.startTime + duration
		trans.finishID = transId
		trans.duration = duration
		trans.AddPos(xt, yt, Self, duration, relative)
		
		trans.transNode = Self.transitionList.AddLast(trans)
		Return trans
	End
	'-----------------------------------------------------------------------------
#Rem
'summery:Create a rotation transition.
'The duration is the time in milliseconds, the transition takes to complete. Only a transID > 0 will fire the [b]ftEngine.OnObjectTrans[/b] method.
#End
	Method CreateTransRot:ftTrans(transRotation:Float, duration:Float, relative:Int, transId:Int=0 )
		Local trans:ftTrans = New ftTrans
		trans.engine = Self.engine
		trans.obj = Self
		trans.layer = Null
		
		'trans.startTime = Self.engine.time
		'trans.currTime = trans.startTime
		trans.currTime = Self.engine.time
		'trans.lastTime = trans.startTime
		'trans.endTime = trans.startTime + duration
		trans.finishID = transId
		trans.duration = duration
		trans.AddRot(transRotation, Self, duration, relative )
		trans.transNode = Self.transitionList.AddLast(trans)
		Return trans
	End
	'-----------------------------------------------------------------------------
#Rem
'summery:Create a scaling transition.
'The duration is the time in milliseconds, the transition takes to complete. Only a transID > 0 will fire the [b]ftEngine.OnObjectTrans[/b] method.
#End
	Method CreateTransScale:ftTrans(transScale:Float, duration:Float, relative:Int, transId:Int=0 )
		Local trans:ftTrans = New ftTrans
		trans.engine = Self.engine
		trans.obj = Self
		trans.layer = Null
		
		'trans.startTime = Self.engine.time
		'trans.currTime = trans.startTime
		trans.currTime = Self.engine.time
		'trans.lastTime = trans.startTime
		'trans.endTime = trans.startTime + duration
		trans.finishID = transId
		trans.duration = duration
		trans.AddScale(transScale, Self, duration, relative )
		trans.transNode = Self.transitionList.AddLast(trans)
		Return trans
	End
	'-----------------------------------------------------------------------------
'summery:Returns the active flag.
	Method GetActive:Bool()
		Return isActive
	End 
	'-----------------------------------------------------------------------------
'summery:Get the alpha value.
	Method GetAlpha:Float()
		Return alpha
	End 
	'-----------------------------------------------------------------------------
'summery:Get the angle the object is heading.
	Method GetAngle:Float()
		Return angle
	End 
	'-----------------------------------------------------------------------------
'summery:Return the isAnimated flag.
	Method GetAnimated:Bool ()
		Return isAnimated
	End
	'-----------------------------------------------------------------------------
'summery:Get the number of animation frames.
	Method GetAnimCount:Int ()
		Return frameCount
	End
	'-----------------------------------------------------------------------------
'summery:Get the current animation frame.
	Method GetAnimFrame:Float ()
		Return (Self.animTime/Self.frameTime)
	End
	'-----------------------------------------------------------------------------
'summery:Get the animation frame time.
	Method GetAnimTime:Float ()
		Return Self.frameTime
	End
	'-----------------------------------------------------------------------------
'summery:Get the blend mode of an object.
	Method GetBlendMode:Int ()
		Return Self.blendMode
	End
	'-----------------------------------------------------------------------------
'summery:Get the child object with the given index (starting with 1).
	Method GetChild:ftObject (index:Int)
		Local c:Int
		Local cc:Int = childObjList.Count()
		If index < 1 Or index > cc Then Error ("~n~nError in file fantomEngine.cftObject, Method ftObject.GetChild():~n~nUsed index ("+index+") is out of bounds (1-"+cc+")")
		For Local child := Eachin childObjList
			c += 1
			If c = index Then Return child
		Next
		Return Null
	End
	'-----------------------------------------------------------------------------
'summery:Returns the child count of an object.
	Method GetChildCount:Int ()
		Return childObjList.Count()
	End
	'-----------------------------------------------------------------------------
'changes:New in version 1.52
'summery:Returns the closest active object.
	Method GetClosestObj:ftObject (useRadius:Bool = True)
		Local dist:Float = 0.0
		Local tmpDist:Float = 0.0
		Local co:ftObject = Null
		Local obj:ftObject = Null
		For obj = Eachin Self.layer.objList
			If obj.isActive = True Then
				If obj <> Self Then 
					tmpDist = Self.GetTargetDist(obj, useRadius)
					If co = Null Then
						dist = tmpDist
						co = obj
					Else
						If tmpDist < dist Then
							dist = tmpDist
							co = obj
						Endif
					Endif
				Endif
			Endif
		Next
		Return co
	End	
	'-----------------------------------------------------------------------------
'summery:Returns the collision group of an object.
	Method GetColGroup:Int ()
		Return collGroup
	End	
	'-----------------------------------------------------------------------------
'summery:Returns the collision type of an object.
	Method GetColType:Int ()
		Return collType
	End	
	'-----------------------------------------------------------------------------
'summery:Returns the data object of this object.
	Method GetDataObj:Object ()
		Return dataObj
	End	
	'-----------------------------------------------------------------------------
#Rem
'summery:Returns an edge position (bottom,top,left,right) of the object.
'The edge parameter can have the following values:
'[list][*]1 = Bottom edge
[*]2 = Top edge
[*]3 = Left edge
[*]4 = Right edge[/list]
'
'If the relative flag is set, then you only get the distance in pixel towards that edge
#End
	Method GetEdge:Float(edge:Int=1, relative:Int = False )
		Local ret:Float = 0.0
		Local xp:Float = 0.0
		Local yp:Float = 0.0
		
		If relative = False Then 
			xp = Self.xPos
			yp = Self.yPos
		Endif
		Select edge
			Case 1		'Bottom
				ret = yp + ((h*Self.scaleY)/2.0)+Self.hOffY
			Case 2		'Top
				ret = yp - ((h*Self.scaleY)/2.0)+Self.hOffY
			Case 3		'Left
				ret = xp - ((w*Self.scaleX)/2.0)+Self.hOffX
			Case 4		'Right
				ret = xp + ((w*Self.scaleX)/2.0)+Self.hOffX
			Default		'Error
				Error ("~n~nError in file fantomEngine.cftObject, Method ftObject.GetEdge():~n~nUsed edge value ("+edge+") is out of bounds (1-4)")
		End
		Return ret
	End 
	'-----------------------------------------------------------------------------
#Rem
'summery:Returns the horizontal and vertical FLIP flags in a Bool array.
'Index 0 contains the horizontal flag and index 1 of the returned array contains the vertical flag.
#End
	Method GetFlip:Bool[]()
		Local f:Bool[2]
		f[0] = Self.isFlipH
	    f[1] = Self.isFlipV
		Return f
	End
	'-----------------------------------------------------------------------------
'summery:Returns the horizontal FLIP flag.
	Method GetFlipH:Bool()
		Return Self.isFlipH
	End
	'-----------------------------------------------------------------------------
'summery:Returns the vetical FLIP flag.
	Method GetFlipV:Bool()
		Return Self.isFlipV
	End
	'-----------------------------------------------------------------------------
'summery:Get the friction value.
	Method GetFriction:Float()
		Return friction
	End 
	'-----------------------------------------------------------------------------
'summery:Returns the group ID of an object.
	Method GetGroupID:Int ()
		Return groupID
	End	
	'-----------------------------------------------------------------------------
#Rem
'summery:Get the height of an object.
The returned value is the stored height multiplied by the Y scale factor.
#End
	Method GetHeight:Float()
		Return h*scaleY
	End 
	'-----------------------------------------------------------------------------
'summery:Returns the ID of an object.
	Method GetID:Int ()
		Return id
	End	
	'------------------------------------------
'summery:Get the objects layer.
	Method GetLayer:ftLayer()
		Return Self.layer
	End
	'-----------------------------------------------------------------------------
'changes:New in v1.51.
#Rem
'summery:Returns the tile map object with the given index. Index starts with 1.
#End
	Method GetMapObj:ftMapObj (index:Int)
		Local c:Int
		Local cc:Int = mapObjList.Count()
		If index < 1 Or index > cc Then Error ("~n~nError in file fantomEngine.cftObject, Method ftObject.GetMapObj():~n~nUsed index ("+index+") is out of bounds (1-"+cc+")")
		For Local mapObj := Eachin mapObjList
			c += 1
			If c = index Then Return mapObj
		Next
		Return Null
	End
	'-----------------------------------------------------------------------------
'changes:New in v1.51.
#Rem
'summery:Returns the number of tile map objects.
'The objects were stored when a Tiled compatible map was loaded.
#End
	Method GetMapObjCount:Int ()
		Return mapObjList.Count()
	End
	'-----------------------------------------------------------------------------
'summery:Get the name of an object.
	Method GetName:String ()
		Return name
	End
	'------------------------------------------
'summery:Get the parent object.
	Method GetParent:ftObject()
		Return Self.parentObj
	End
	'-----------------------------------------------------------------------------
'summery:Returns the objects X and Y position in a 2D Float array.
	Method GetPos:Float[]()
		Local p:Float[2]
		p[0] = xPos
	    p[1] = yPos
		Return p		
	End
	'-----------------------------------------------------------------------------
'summery:Get the X position.
	Method GetPosX:Float()
		Return xPos
	End 
	'-----------------------------------------------------------------------------
'summery:Get the Y position.
	Method GetPosY:Float()
		Return yPos
	End 
	'-----------------------------------------------------------------------------
'summery:Get the Z position.
	Method GetPosZ:Float()
		Return zPos
	End 
	'-----------------------------------------------------------------------------
'summery:Returns the radius of an object.
	Method GetRadius:Float()
		Return radius*scaleX
	End 
	'-----------------------------------------------------------------------------
'summery:Get current scale factor of an object.
	Method GetScale:Float()
		Return scaleX
	End 
	'-----------------------------------------------------------------------------
'summery:Returns the X scale factor (width) of the object.
	Method GetScaleX:Float()
		Return scaleX
	End 
	'-----------------------------------------------------------------------------
'summery:Returns the Y scale factor (height) of the object.
	Method GetScaleY:Float()
		Return scaleY
	End 
	'-----------------------------------------------------------------------------
'summery:Get current linear speed of an object.
	Method GetSpeed:Float()
		Return speed
	End 
	'-----------------------------------------------------------------------------
'summery:Get the current speed angle.
	Method GetSpeedAngle:Float()
		Return Self.speedAngle
	End 
	'-----------------------------------------------------------------------------
'summery:Get the max speed of an object.
	Method GetSpeedMax:Float()
		Return speedMax
	End 
	'-----------------------------------------------------------------------------
'summery:Get the minimum speed of an object.
	Method GetSpeedMin:Float()
		Return speedMin
	End 
	'-----------------------------------------------------------------------------
'summery:Get the current X speed.
	Method GetSpeedX:Float()
		Return speedX
	End 
	'-----------------------------------------------------------------------------
'summery:Get current the X and Y speed of a 2D Float array.
	Method GetSpeedXY:Float[]()
		Local sp:Float[2]
		sp[0] = speedX
	    sp[1] = speedY
		Return sp		
	End
	'-----------------------------------------------------------------------------
'summery:Get the current Y speed.
	Method GetSpeedY:Float()
		Return speedY
	End 
	'-----------------------------------------------------------------------------
'summery:Get the spin speed value.
	Method GetSpin:Float()
		Return speedSpin
	End 
	'-----------------------------------------------------------------------------
'summery:Get the object tag value.
	Method GetTag:Int ()
		Return tag
	End	
	'-----------------------------------------------------------------------------
#rem
'summery:Returns the angle to a target object.
'If the relative flag is set, then the angle takes the object angle into account.
#End
	Method GetTargetAngle:Float(targetObj:ftObject, relative:Int=False)
		Local xdiff:Float
		Local ydiff:Float 
		Local ang:Float
			
		xdiff = targetObj.xPos - xPos
		ydiff = targetObj.yPos - yPos
			
    	ang = ATan2( ydiff, xdiff )+90.0
		If ang < 0 Then 
			ang = 360.0 + ang
		Endif
		If relative=True Then
			ang -= Self.angle
			If ang > 180.0 Then
				ang -= 360.0
			Elseif ang < -180.0 Then
				ang += 360.0
			Endif
		Endif
		Return ang
	End
	'-----------------------------------------------------------------------------
'changes:Changed in version 1.52.
#rem
'summery:Get the distance to a target object.
'Which the useRadius flag set, it will substract the radius of each object from the distance
#end
	Method GetTargetDist:Float(targetObj:ftObject, useRadius:Bool = False)
		Local xdiff:Float
		Local ydiff:Float 
		Local dist:Float
		
		xdiff = targetObj.xPos - xPos
		ydiff = targetObj.yPos - yPos
		
		dist = Sqrt(xdiff * xdiff + ydiff * ydiff)
		If useRadius = True Then
			dist = dist - Self.GetRadius() - targetObj.GetRadius()
		Endif
		
		Return dist
	End
	'-----------------------------------------------------------------------------
'summery:Get the text field of an object.
	Method GetText:String ()
		Return text
	End
	'-----------------------------------------------------------------------------
'changes:New in v1.52
#Rem
'summery:Returns the tile index at the given canvas coordinates, starting from zero.
#End

	Method GetTileAt:Int(xp:Int,yp:Int)
		Local left2:Float, right2:Float, top2:Float, bottom2:Float
		Local tlW:Float, tlH:Float, tlxPos:Float, tlyPos:Float
		Local ytX:Int, ytY:Int, tilePos:Int, tileIDx:Int
		
		Local _cw:Float = engine.GetCanvasWidth()
		Local _ch:Float = engine.GetCanvasHeight()
		
		Local xoff:Float = Self.layer.xPos-Self.engine.camX
		Local yoff:Float = Self.layer.yPos-Self.engine.camY
		
		tlW = Self.tileSizeX * Self.scaleX
		tlH = Self.tileSizeY * Self.scaleY
		Local tlW2:Float = tlW/2.0
		Local tlH2:Float = tlH/2.0
		
		'Determine the first and last xCoordinate
		Local xFirst:Int = 1
		Local xLast:Int = Self.tileCountX
		
		For ytX = 1 To Self.tileCountX
			tlxPos = xoff+xPos+Self.tileMap[ytX-1].xOff * Self.scaleX
			If (tlxPos+tlW2)>=0 And (tlxPos-tlW2)<=_cw Then 
				xFirst = ytX
				Exit
			Endif
		Next
		
		For ytX = (xFirst+1) To Self.tileCountX
			tlxPos = xoff+xPos+Self.tileMap[ytX-1].xOff * Self.scaleX
			If (tlxPos+tlW2)<0 Or (tlxPos-tlW2)>_cw Then 
				xLast = ytX-1
				Exit
			Endif
		Next
		
		'Determine the first and last yCoordinate
		Local yFirst:Int = 1
		Local yLast:Int = Self.tileCountY
		
		For ytY = 1 To Self.tileCountY
			tilePos = (ytY-1)*Self.tileCountX
			tlyPos = yoff+yPos+Self.tileMap[tilePos].yOff * Self.scaleY
			If (tlyPos+tlH2)>=0 And (tlyPos-tlH2)<=_ch Then 
				yFirst = ytY
				Exit
			Endif
		Next
		
		For ytY = (yFirst+1) To Self.tileCountY
			tilePos = (ytY-1)*Self.tileCountX
			tlyPos = yoff+yPos+Self.tileMap[tilePos].yOff * Self.scaleY
			If (tlyPos+tlH2)<0 Or (tlyPos-tlH2)>_ch Then 
				yLast = ytY-1
				Exit
			Endif
		Next
		
		For ytY = yFirst To yLast
			For ytX = xFirst To xLast							
				tilePos = (ytX-1)+(ytY-1)*Self.tileCountX
				tileIDx = Self.tileMap[tilePos].tileID

				'If tileIDx <> - 1 Then
					tlxPos = Self.xPos + Self.tileMap[tilePos].xOff * Self.scaleX
					tlyPos = Self.yPos + Self.tileMap[tilePos].yOff * Self.scaleY
					left2   = tlxPos - (tlW)/2.0
					right2  = left2 + tlW
					top2    = tlyPos - (tlH)/2.0
					bottom2 = top2 + tlH
					If (yp < top2) Then Continue
					If (yp > bottom2) Then Continue
					If (xp < left2) Then Continue
					If (xp > right2) Then Continue
					Return tilePos  
				'Endif
			Next
		Next	
		Return -1
	End

	'-----------------------------------------------------------------------------
#Rem
'summery:Returns the ID of the tiles texture map, at the given map row and column, starting from zero. 
It returns -1 if there is no tile.
#End
	Method GetTileID:Int(column:Int, row:Int)
		Local pos:Int = column+row*Self.tileCountX
		If pos < 0 Then 
			pos = 0
		Elseif pos > (Self.tileCount-1) Then
			pos = Self.tileCount - 1
		Endif
		Return Self.tileMap[pos].tileID
	End
	'-----------------------------------------------------------------------------
'changes:Huge performance gain v1.51
#Rem
'summery:Returns the ID of the tiles texture, at the given canvas coordinates, starting from zero.
It returns -1 if there is no tile.
#End

	Method GetTileIDAt:Int(xp:Int,yp:Int)
		Local left2:Float, right2:Float, top2:Float, bottom2:Float
		Local tlW:Float, tlH:Float, tlxPos:Float, tlyPos:Float
		Local ytX:Int, ytY:Int, tilePos:Int, tileIDx:Int
		
		Local _cw:Float = engine.GetCanvasWidth()
		Local _ch:Float = engine.GetCanvasHeight()
		
		Local xoff:Float = Self.layer.xPos-Self.engine.camX
		Local yoff:Float = Self.layer.yPos-Self.engine.camY
		'tempScaleX = tempScaleX + Self.tileModSX
		'tempScaleY = tempScaleY + Self.tileModSY
		
		tlW = Self.tileSizeX * Self.scaleX
		tlH = Self.tileSizeY * Self.scaleY
		Local tlW2:Float = tlW/2.0
		Local tlH2:Float = tlH/2.0
		
		'Determine the first and last xCoordinate
		Local xFirst:Int = 1
		Local xLast:Int = Self.tileCountX
		
		For ytX = 1 To Self.tileCountX
			tlxPos = xoff+xPos+Self.tileMap[ytX-1].xOff * Self.scaleX
			If (tlxPos+tlW2)>=0 And (tlxPos-tlW2)<=_cw Then 
				xFirst = ytX
				Exit
			Endif
		Next
		
		For ytX = (xFirst+1) To Self.tileCountX
			tlxPos = xoff+xPos+Self.tileMap[ytX-1].xOff * Self.scaleX
			If (tlxPos+tlW2)<0 Or (tlxPos-tlW2)>_cw Then 
				xLast = ytX-1
				Exit
			Endif
		Next
		
		'Determine the first and last yCoordinate
		Local yFirst:Int = 1
		Local yLast:Int = Self.tileCountY
		
		For ytY = 1 To Self.tileCountY
			tilePos = (ytY-1)*Self.tileCountX
			tlyPos = yoff+yPos+Self.tileMap[tilePos].yOff * Self.scaleY
			If (tlyPos+tlH2)>=0 And (tlyPos-tlH2)<=_ch Then 
				yFirst = ytY
				Exit
			Endif
		Next
		
		For ytY = (yFirst+1) To Self.tileCountY
			tilePos = (ytY-1)*Self.tileCountX
			tlyPos = yoff+yPos+Self.tileMap[tilePos].yOff * Self.scaleY
			If (tlyPos+tlH2)<0 Or (tlyPos-tlH2)>_ch Then 
				yLast = ytY-1
				Exit
			Endif
		Next
		
		For ytY = yFirst To yLast
			For ytX = xFirst To xLast							
				tilePos = (ytX-1)+(ytY-1)*Self.tileCountX
				tileIDx = Self.tileMap[tilePos].tileID

				If tileIDx <> - 1 Then
					'tlxPos = xoff+xPos+Self.tileMap[tilePos].xOff * Self.scaleX
					'tlyPos = yoff+yPos+Self.tileMap[tilePos].yOff * Self.scaleY
					
					tlxPos = Self.xPos + Self.tileMap[tilePos].xOff * Self.scaleX
					tlyPos = Self.yPos + Self.tileMap[tilePos].yOff * Self.scaleY
					left2   = tlxPos - (tlW)/2.0
					right2  = left2 + tlW
					top2    = tlyPos - (tlH)/2.0
					bottom2 = top2 + tlH
					If (yp < top2) Then Continue
					If (yp > bottom2) Then Continue
					If (xp < left2) Then Continue
					If (xp > right2) Then Continue
					Return tileIDx  
				Endif
			Next
		Next	
		Return -1
	End

#rem
	Method GetTileIDAt_Old:Int(xp:Int, yp:Int)
	
		Local left2:Float, right2:Float, top2:Float, bottom2:Float
		Local tlW:Float, tlH:Float, tlxPos:Float, tlyPos:Float
		Local ytX:Int, ytY:Int, tilePos:Int, tileIDx:Int
		      
		      
		tlW = Self.tileSizeX * Self.scaleX
		tlH = Self.tileSizeY * Self.scaleY
		For ytY = 1 To Self.tileCountY
			For ytX = 1 To Self.tileCountX
			
				tilePos = (ytX-1)+(ytY-1)*Self.tileCountX
				tileIDx = Self.tileMap[tilePos].tileID
				If tileIDx <> - 1 Then
					tlxPos = Self.xPos + Self.tileMap[tilePos].xOff * Self.scaleX
					tlyPos = Self.yPos + Self.tileMap[tilePos].yOff * Self.scaleY
					left2   = tlxPos - (tlW)/2.0
					right2  = left2 + tlW
					top2    = tlyPos - (tlH)/2.0
					bottom2 = top2 + tlH
					If (yp < top2) Then Continue
					If (yp > bottom2) Then Continue
					If (xp < left2) Then Continue
					If (xp > right2) Then Continue
					Return tileIDx  
				Endif
			Next
		Next
		
		Return -1
		
	End
#End	
	'-----------------------------------------------------------------------------
'summery:Returns the touchmode of an object.
	Method GetTouchMode:Int()
		Return touchMode
	End
	'-----------------------------------------------------------------------------
'summery:Returns the amount of active transitions of an object.
	Method GetTransitionCount:Int ()
		Return transitionList.Count()
	End
	'-----------------------------------------------------------------------------
#Rem
'summery:Returns the type of an object.
The value of the type of an object can be one of the following ones:
[list][*]ftEngine.otImage   (Value = 0)
[*]ftEngine. otText   (Value = 1)
[*]ftEngine.otCircle   (Value = 2)
[*]ftEngine.otBox   (Value = 3)
[*]ftEngine.otZoneBox   (Value = 4)
[*]ftEngine.otZoneCircle   (Value = 5)
[*]ftEngine.otTileMap   (Value = 6)
[*]ftEngine.otTextMulti   (Value = 7)
[*]ftEngine.otPoint   (Value = 8)
[*]ftEngine.otStickMan   (Value = 9)
[*]ftEngine.otOval   (Value = 10)
[*]ftEngine.otLine   (Value = 11)
[*]ftEngine.otPoly   (Value = 12)[/list]
#End
	Method GetType:Int ()
		Return self.type
	End
	'-----------------------------------------------------------------------------
'summery:Determines a 2D vector from the objects center calculated by the given distance and angle.
	Method GetVector:Float[](vecDistance:Float, vecAngle:Float, relative:Bool=False)
		Local v:Float[2]
		Local a:Float
		If relative = True Then
			a = angle + vecAngle
		Else
			a = vecAngle
		Endif
	    v[0] = xPos + Sin(a) * vecDistance
	    v[1] = yPos - Cos(a) * vecDistance
		Return v		
	End
	'-----------------------------------------------------------------------------
'summery:Get the angle from the objects center to the given vector.
	Method GetVectorAngle:Float(vecXPos:Float, vecYPos:Float, relative:Int=False)
		Local xdiff:Float
		Local ydiff:Float 
		Local dist:Float
		Local ang:Float
			
		xdiff = vecXPos - xPos
		ydiff = vecYPos - yPos
			
    	ang = ATan2( ydiff, xdiff )+90.0
		If ang < 0 Then 
			ang = 360.0 + ang
		Endif
		If relative=True Then
			ang -= Self.angle
			If ang > 180.0 Then
				ang -= 360.0
			Elseif ang < -180.0 Then
				ang += 360.0
			Endif
		Endif
		Return ang
	End
	'-----------------------------------------------------------------------------
'summery:Get the distance in pixel from the objects center to the given vector.
	Method GetVectorDist:Float(vecXPos:Float, vecYPos:Float)
		Local xdiff:Float
		Local ydiff:Float 
		Local dist:Float
		
		xdiff = vecXPos - xPos
		ydiff = vecYPos - yPos
		
		dist = Sqrt(xdiff * xdiff + ydiff * ydiff)
		
		Return dist
	End
	'-----------------------------------------------------------------------------
'summery:Returns the visible flag.
	Method GetVisible:Bool()
		Return isVisible
	End 
	'-----------------------------------------------------------------------------
#Rem
'summery:Returns the width of an object. 
The returned value is the stored width multiplied by the X scale factor.
#End
	Method GetWidth:Float()
		Return w*scaleX
	End 
	'-----------------------------------------------------------------------------
'summery:Pause all timer of an object.
	Method PauseTimerAll:Void()
		For Local timer := Eachin timerList 
			timer.SetPaused(True)
		Next
	End
	'-----------------------------------------------------------------------------
'changes:New in version 1.51
'summery:Pause all  transitions attached to an object.
	Method PauseTransAll:Void()
		For Local trans := Eachin transitionList    
			trans.SetPaused(True)
		Next
	End
	'------------------------------------------
'summery:Removes an object.
	Method Remove:Void(directFlag:Bool = False)
		For Local child := Eachin childObjList
			child.Remove(directFlag)
		Next
		For Local trans := Eachin transitionList    '1.2.1
			trans.Cancel()
		Next
		For Local timer := Eachin timerList    '1.2.1
			timer.RemoveTimer()
		Next
		If directFlag = True Then
			If Self.parentObj <> Null Then
				'Self.parentObj.childObjList.Remove(Self)
				Self.parentNode.Remove()     '1.2.1
				Self.parentObj = Null
			Endif
			'If Self.layer <> Null Then Self.layer.objList.Remove(Self)
			If Self.layer <> Null Then 
				Self.layerNode.Remove()        '1.2.1
				Self.layer = Null
			Endif
			If Self.marker <> Null Then 
				Self.markerNode.Remove() 
				Self.marker = Null
			Endif
			If Self.onDeleteEvent = True Then engine.OnObjectDelete(Self)
		Else
			Self.deleted = True
		Endif
		
	End
	'------------------------------------------
'summery:Renders an object.
#rem
'changes:In version 1.51, rendering an animated object checks against the internal frame count. Also HUGE performance gain with huge tilemap. 
#end
	Method Render:Void(xoff:Float=0.0, yoff:Float=0.0)
		Local txOff:Float
		Local tyOff:Float
		Local mAlpha:Float
		Local tempScaleX:Float
		Local tempScaleY:Float
		Local tilePos:Int
		Local tileIDx:Int
		Local tlxPos:Float
		Local tlyPos:Float
		Local tlW:Float
		Local tlH:Float
		Local tlW2:Float
		Local tlH2:Float
		Local ytY:Int
		Local ytX:Int
		Local _y:Int
		Local px:Float
		Local py:Float
		Local tmpFrame:Int
		Local drawAngle:Float
		Local _cw:Float
		Local _ch:Float
		
		
		If deleted = False Then
			
			'Change alpha if needed
			mAlpha = Self.alpha * layer.alpha
			If engine.alpha <> mAlpha Then 
				mojo.SetAlpha(mAlpha)
				engine.alpha = mAlpha
			Endif
			
			'Change color if needed
			If engine.red <> Self.red Or engine.green <> Self.green Or engine.blue <> Self.blue Then 
				mojo.SetColor(Self.red, Self.green, Self.blue)
				engine.red = Self.red
				engine.green = Self.green
				engine.blue = Self.blue
			Endif
			
			'Change blendmode if needed
			If engine.blendMode <> Self.blendMode Then 
				mojo.SetBlend(Self.blendMode)
				engine.blendMode = Self.blendMode
			Endif
			
			If Self.isFlipV Then
				tempScaleY = Self.scaleY * -1
			Else
				tempScaleY = Self.scaleY
			Endif 
			If Self.isFlipH Then
				tempScaleX = Self.scaleX * -1
			Else
				tempScaleX = Self.scaleX
			Endif 
			
			Select type
	'**------------------------------------------------------------------------------------------------------------------------------------------------------**
	
				Case ftEngine.otPoint
					'DrawPoint xPos - w * (Self.handleX) + xoff, yPos - h * (Self.handleY) + yoff
					DrawPoint xPos + xoff, yPos + yoff
				Case ftEngine.otStickMan
					PushMatrix
					Translate ((xPos+xoff), (yPos+yoff))
					Rotate 360.0-angle
					Scale (Self.scaleX, Self.scaleY)
					DrawCircle (-w*(Self.handleX))+4, (-h*(Self.handleY))+4, 4						' o Head
					DrawLine (-w*(Self.handleX))+4, (-h*(Self.handleY))+6,  (-w*(Self.handleX))+4, (-h*(Self.handleY))+25	' | Body	
					DrawLine (-w*(Self.handleX))+4, (-h*(Self.handleY))+14, (-w*(Self.handleX))+8, (-h*(Self.handleY))+18	' \ Arm			
					DrawLine (-w*(Self.handleX))+4, (-h*(Self.handleY))+25, (-w*(Self.handleX)),   (-h*(Self.handleY))+29	' / Leg			
					DrawLine (-w*(self.handleX))+4, (-h*(Self.handleY))+25, (-w*(Self.handleX))+8, (-h*(Self.handleY))+29	' \ Leg			
					PopMatrix
				Case ftEngine.otOval
					PushMatrix
					Translate ((xPos+xoff), (yPos+yoff)) 
					Rotate 360.0-angle
					'DrawOval xPos - w * (Self.handleX) + xoff, yPos - h * (Self.handleY) + yoff, w, h
					DrawOval -w * (Self.handleX), -h * (Self.handleY), w, h
					PopMatrix
				Case ftEngine.otLine
					PushMatrix
					Translate ((xPos+xoff), (yPos+yoff)) 
					Rotate 360.0-angle+90.0
					'DrawLine xPos - w * (Self.handleX) + xoff, yPos - h * (Self.handleY) + yoff, x2 - w * (Self.handleX) + xoff, y2 - h * (Self.handleY) + yoff
					DrawLine -w * (Self.handleX), 0, w - (w * Self.handleX), 0
					PopMatrix
				Case ftEngine.otPoly
					PushMatrix
					Translate ((xPos + xoff), (yPos + yoff))
					Rotate 360.0-angle
					Scale (Self.scaleX, Self.scaleY)
					DrawPoly (verts)
					PopMatrix								
	'**------------------------------------------------------------------------------------------------------------------------------------------------------**
				Case ftEngine.otImage
					px = Self.hOffX+xPos+xoff
					py = Self.hOffY+yPos+yoff
					If isAnimated = True Then
						If (px+w/2)>=0 And (px-w/2) <= engine.GetCanvasWidth() Then
							If (py+h/2)>=0 And (py-h/2) <= engine.GetCanvasHeight() Then
#rem
							If img.Frames()<=Int(Min(frameCount-1,(Self.animTime/Self.frameTime))) Then
								Print ("img.frames.Length="+img.Frames())
								Print("frameCount-1="+(frameCount))
								Print("Self.animTime="+Self.animTime)
								Print("Self.frameTime="+Self.frameTime)
								Print("Self.animTime/Self.frameTime="+Self.animTime/Self.frameTime)
								Print("name="+Self.name)
							Endif
#End
								tmpFrame = Int(Min(frameCount-1,(Self.animTime/Self.frameTime)))
								DrawImageRect( Self.objImg.img, px, py, rox, roy, rw, rh, 360-angle+offAngle, tempScaleX, tempScaleY, Min(tmpFrame,(Self.objImg.img.Frames()-1)))
							Endif
						Endif
					Else
						If (px+w/2)>=0 And (px-w/2) <= engine.canvasWidth Then
							If (py+h/2)>=0 And (py-h/2) <= engine.canvasHeight Then
								DrawImageRect( Self.objImg.img, px, py, rox, roy, rw, rh, 360-angle+offAngle, tempScaleX, tempScaleY)
							Endif
						Endif
					Endif
					
				Case ftEngine.otTileMap
					_cw = engine.GetCanvasWidth()
					_ch = engine.GetCanvasHeight()
					tempScaleX = tempScaleX + Self.tileModSX
					tempScaleY = tempScaleY + Self.tileModSY
					
					tlW = Self.tileSizeX * Self.scaleX
					tlH = Self.tileSizeY * Self.scaleY
					tlW2 = tlW/2.0
					tlH2 = tlH/2.0
					drawAngle = 360.0-Self.angle
					
					'Determine the first and last xCoordinate
					Local xFirst:Int = 1
					Local xLast:Int = Self.tileCountX
					
					For ytX = 1 To Self.tileCountX
						tlxPos = xoff+xPos+Self.tileMap[ytX-1].xOff * Self.scaleX
						If (tlxPos+tlW2)>=0 And (tlxPos-tlW2)<=_cw Then 
							xFirst = ytX
							Exit
						Endif
					Next
					
					'For ytX = Self.tileCountX To xFirst Step -1
					For ytX = (xFirst+1) To Self.tileCountX
						tlxPos = xoff+xPos+Self.tileMap[ytX-1].xOff * Self.scaleX
						'If (tlxPos+tlW2)>=0 And (tlxPos-tlW2)<=_cw Then 
						If (tlxPos+tlW2)<0 Or (tlxPos-tlW2)>_cw Then 
							'xLast = ytX
							xLast = ytX-1
							Exit
						Endif
					Next
					
					'Determine the first and last yCoordinate
					Local yFirst:Int = 1
					Local yLast:Int = Self.tileCountY
					
					For ytY = 1 To Self.tileCountY
						tilePos = (ytY-1)*Self.tileCountX
						tlyPos = yoff+yPos+Self.tileMap[tilePos].yOff * Self.scaleY
						If (tlyPos+tlH2)>=0 And (tlyPos-tlH2)<=_ch Then 
							yFirst = ytY
							Exit
						Endif
					Next
					
					'For ytY = Self.tileCountY To yFirst Step -1
					For ytY = (yFirst+1) To Self.tileCountY
						tilePos = (ytY-1)*Self.tileCountX
						tlyPos = yoff+yPos+Self.tileMap[tilePos].yOff * Self.scaleY
						'If (tlyPos+tlH2)>=0 And (tlyPos-tlH2)<=_ch Then 
						If (tlyPos+tlH2)<0 Or (tlyPos-tlH2)>_ch Then 
							'yLast = ytY
							yLast = ytY-1
							Exit
						Endif
					Next
					
					'For ytY = 1 To Self.tileCountY
					For ytY = yFirst To yLast
						'For ytX = 1 To Self.tileCountX
						For ytX = xFirst To xLast							
							tilePos = (ytX-1)+(ytY-1)*Self.tileCountX
							tileIDx = Self.tileMap[tilePos].tileID

							If tileIDx <> - 1 Then
								tlxPos = xoff+xPos+Self.tileMap[tilePos].xOff * Self.scaleX
								tlyPos = yoff+yPos+Self.tileMap[tilePos].yOff * Self.scaleY
								
								'If (tlxPos+tlW2)>=0 And (tlxPos-tlW2)<=_cw Then
									'If (tlyPos+tlH2)>=0 And (tlyPos-tlH2)<=_ch Then
									
										DrawImageRect( Self.objImg.img, tlxPos, tlyPos, rox, roy, rw, rh, drawAngle, tempScaleX, tempScaleY, tileIDx)
										
									'Endif
								'Endif
							Endif
						Next
					Next	
					'DrawText("xFirst="+xFirst,10,300)
					'DrawText("xLast="+xLast,10,320)
					
					'DrawText("yFirst="+yFirst,10,340)
					'DrawText("yLast="+yLast,10,360)
					
				Case ftEngine.otCircle
					PushMatrix
					Translate ((xPos+xoff), (yPos+yoff)) 
					Rotate 360.0-angle
					'DrawCircle xPos - w * (Self.handleX-0.5) + xoff, yPos - h * (Self.handleY-0.5) + yoff, radius * Self.scaleX
					DrawCircle -w * (Self.handleX-0.5), -h * (Self.handleY-0.5), radius * Self.scaleX
					PopMatrix
				Case ftEngine.otBox
					PushMatrix
					Translate ((xPos+xoff), (yPos+yoff)) 
					Rotate 360.0-angle
					Scale (Self.scaleX, Self.scaleY)
					'DrawRect -w/2.0, -h/2.0, w, h
					DrawRect -w*Self.handleX, -h*Self.handleY, w, h
					PopMatrix
				Case ftEngine.otText
					PushMatrix
					Translate ((xPos+xoff), (yPos+yoff))
					Rotate 360.0-angle
					Scale (Self.scaleX, Self.scaleY)
					Select Self.textMode
						Case 0			'topLeft
							txOff = 0.0
							tyOff = 0.0
						Case 1			'topCenter
							txOff = -(Float(Self.objFont.Length(Self.text))/2.0) 
							tyOff = 0.0
						Case 2			'topRight
							txOff = -Self.objFont.Length(Self.text)
							tyOff = 0.0
							
						Case 7			'centerLeft
							txOff = 0.0
							tyOff = -(Float(Self.objFont.Height())/2.0) 
						Case 3			'centerCenter
							txOff = -(Float(Self.objFont.Length(Self.text))/2.0) 
							tyOff = -(Float(Self.objFont.Height())/2.0) 
						Case 4			'centerRight
							txOff = -Self.objFont.Length(Self.text)
							tyOff = -(Float(Self.objFont.Height())/2.0) 
							
						Case 8			'bottomLeft
							txOff = 0.0
							tyOff = -(Float(Self.objFont.Height())) 
						Case 5 			'bottomCenter
							txOff = -(Float(Self.objFont.Length(Self.text))/2.0) 
							tyOff = -(Float(Self.objFont.Height())) 
						Case 6			'bottomRight
							txOff = -Self.objFont.Length(Self.text)
							tyOff = -(Float(Self.objFont.Height())) 
					End
					objFont.Draw(text, txOff, tyOff)
					PopMatrix
				Case ftEngine.otTextMulti
					PushMatrix
					Translate ((xPos+xoff), (yPos+yoff))
					Rotate 360.0-angle
					Scale (Self.scaleX, Self.scaleY)
					Local lines:String[] = Self.text.Split("~n")
					Local objFontHeight:Float = Self.objFont.Height()
					Local linesCount:Int = lines.Length()
					
					For _y = 1 To linesCount

						Select Self.textMode
							Case 0			'topLeft
								txOff = 0.0
								tyOff = 0.0 + (objFontHeight*(_y-1))
								
							Case 1			'topCenter
								txOff = -(Float(Self.objFont.Length(lines[_y-1]))/2.0) 
								tyOff = 0.0 + (objFontHeight*(_y-1))
								
							Case 2			'topRight
								txOff = -Self.objFont.Length(lines[_y-1])
								tyOff = 0.0 + (objFontHeight*(_y-1))
								
							Case 7			'centerLeft
								txOff = 0.0
								tyOff = -((objFontHeight*linesCount)/2.0)  + (objFontHeight*(_y-1))
								
							Case 3			'centerCenter
								txOff = -(Float(Self.objFont.Length(lines[_y-1]))/2.0) 
								tyOff = -((objFontHeight*linesCount)/2.0)  + (objFontHeight*(_y-1))
								 
							Case 4			'centerRight
								txOff = -Self.objFont.Length(lines[_y-1])
								tyOff = -((objFontHeight*linesCount)/2.0)  + (objFontHeight*(_y-1))
								
							Case 8			'bottomLeft
								txOff = 0.0
								tyOff = -(objFontHeight*linesCount) + (objFontHeight*(_y-1))
								
							Case 5 			'bottomCenter
								txOff = -(Float(Self.objFont.Length(lines[_y-1]))/2.0) 
								tyOff = -(objFontHeight*linesCount) + (objFontHeight*(_y-1)) 
								
							Case 6			'bottomRight
								txOff = -Self.objFont.Length(lines[_y-1])
								tyOff = -(objFontHeight*linesCount) + (objFontHeight*(_y-1)) 
								
						End
						objFont.Draw(lines[_y-1], txOff, tyOff)
					Next
					PopMatrix
			End
			If Self.onRenderEvent = True Then engine.OnObjectRender(Self)
			For Local child := Eachin childObjList
				If child.isVisible And child.isActive Then child.Render(xoff, yoff)
			Next
		Endif
	End	
	'-----------------------------------------------------------------------------
'summery:Resume all paused timer of an object.
	Method ResumeTimerAll:Void()
		For Local timer := Eachin timerList 
			timer.SetPaused(False)
		Next
	End
	'-----------------------------------------------------------------------------
'changes:New in version 1.51
'summery:Resume all  transitions attached to an object.
	Method ResumeTransAll:Void()
		For Local trans := Eachin transitionList    
			trans.SetPaused(False)
		Next
	End
	'-----------------------------------------------------------------------------
'summery:Set the active flag.
	Method SetActive:Void (activeFlag:Bool = True )
		isActive = activeFlag
	End
	'------------------------------------------
'summery:Set the alpha value of an object. (Ranging from 0.0 to 1.0)
	Method SetAlpha:Void(newAlpha:Float, relative:Int=False)
		If relative=True Then
			alpha += newAlpha
		Else
			alpha = newAlpha
		Endif
		If alpha < 0.0 Then alpha = 0.0
		If alpha > 1.0 Then alpha = 1.0
	End
	'------------------------------------------
'summery:Set the objects angle.
	Method SetAngle:Void (newAngle:Float, relative:Int = False )
		Local angDiff:Float
		If relative = True
			angDiff = newAngle
			angle = angle + newAngle
		Else
			angDiff = newAngle - angle
			angle = newAngle
		Endif
		For Local child := Eachin childObjList
			child.internal_OrbitChild(angDiff)
			child.SetAngle(newAngle, relative)
		Next
		If Self.angle > 360.0 Self.angle = Self.angle - 360
		If Self.angle < 0.0 Self.angle = Self.angle + 360.0
		internal_RotateSpriteCol(Self)
	End
	'-----------------------------------------------------------------------------
'summery:Turn the animation of an animated object on/off.
	Method SetAnimated:Void (animFlag:Bool = True )
		Self.isAnimated = animFlag
	End
	'-----------------------------------------------------------------------------
'summery:Set the current animation frame.
	Method SetAnimFrame:Void (frame:Float )
		If frame < 1 Then 
			frame = 1
		Elseif frame > Self.frameCount Then
			frame = Self.frameCount
		Elseif frame > 32 Then
			frame = 32
		Endif
		Self.animTime = (frame-1) * Self.frameTime
	End
	'-----------------------------------------------------------------------------
'summery:Set the animation range for an animated object.
	Method SetAnimRange:Void (startFrame:Float, endFrame:Float )
		Self.frameStart = startFrame
		Self.frameEnd = endFrame
		Self.animTime = (startFrame-1) * Self.frameTime
		Self.frameLength = endFrame - startFrame + 1
	End
	'-----------------------------------------------------------------------------
'summery:Set the animation frame time.
	Method SetAnimTime:Void (time:Float )
		Self.animTime = Self.animTime/Self.frameTime
		Self.animTime = Self.animTime * time
		Self.frameTime = time
	End
	'-----------------------------------------------------------------------------
'summery:Set the blend mode of an object.
	Method SetBlendMode:Void (blendmode:Int = 0)
		If blendmode < 0 Or blendmode > 1 Then Error ("~n~nError in file fantomEngine.cftObject, Method ftObject.SetBlendMode(blendmode:Int = 0):~n~nUsed mode "+blendmode+" is wrong. Must be 0 or 1")
		Self.blendMode = blendmode
	End
	'-----------------------------------------------------------------------------
#Rem
'summery:Set the objects collision group. 
A value of 0 will disable the collision, a value between 1 and 32 will set the collision group.
#End
	Method SetColGroup:Void (collisionGroup:Int)
		Local cc:Int = Self.collWith.Length()
		If collisionGroup < 0 Or collisionGroup > cc Then Error ("~n~nError in file fantomEngine.cftObject, Method ftObject.SetColGroup(collisionGroup:Int):~n~nUsed index is wrong. Bounds are 0-"+cc+".")
		Self.collGroup = collisionGroup
	End
	'-----------------------------------------------------------------------------
'summery:Set the color of an object.
	Method SetColor:Void(cRed:Float, cGreen:Float, cBlue:Float)
		Self.red = cRed
		Self.green = cGreen
		Self.blue = cBlue
	End
	'-----------------------------------------------------------------------------
#Rem
'summery:Sets the collision scale factor of an object.
'The collision scale affects the calculation of the collision type objects (circle, bounding box, rotated box)
#End
	Method SetColScale:Void (colScale:Float = 1.0)
		Self.collScale = colScale
	End
	'-----------------------------------------------------------------------------
#Rem
'summery:Set the collision type of an object.
'Collision types can be:
[list][*]Const ctCircle% = 0
[*]Const ctBox% = 1   (this will check against the rotated box of the object)
[*]Const ctBound% = 2   (This will check against the bounding box of the object)[/list]
#End
	Method SetColType:Void (colltype:Int)
		Self.collType = colltype
	End
	'-----------------------------------------------------------------------------
'changes:Help text changed in version 1.51.
#Rem
'summery:Set with which collision groups an object can collide.
'Indexes go from 1 to 32.
#End
	Method SetColWith:Void (startIndex:Int, endIndex:Int, boolFlag:Bool)
		Local cc:Int = Self.collWith.Length()
		If startIndex < 1 Or endIndex > cc Or startIndex > endIndex Then Error ("~n~nError in file fantomEngine.cftObject, Method ftObject.SetColWith(startIndex:Int, endIndex:Int, boolFlag:Bool):~n~nUsed index is wrong. Bounds are 1-"+cc+".")
		For Local i:Int = (startIndex-1) To (endIndex-1)
			Self.collWith[i] = boolFlag
		Next
		If boolFlag = True Then
			Self.colCheck = True
		Else
			Self.colCheck = False
			For Local i:Int = 0 To cc
				If collWith[i] = True Then
					Self.colCheck = True
					Exit
				Endif
			Next
		Endif
	End
	'-----------------------------------------------------------------------------
'changes:Help text changed in version 1.51.
#Rem
'summery:Set with which collision group an object can collide.
'Indexes go from 1 to 32.
#End
	Method SetColWith:Void (index:Int,boolFlag:Int)
		Local cc:Int = Self.collWith.Length()
		If index < 1 Or index > cc Then Error ("~n~nError in file fantomEngine.cftObject, Method ftObject.SetColWith(index, boolFlag):~n~nUsed index ("+index+") is out of bounds (1-"+cc+")")
		collWith[index-1] = boolFlag
		If boolFlag = True Then
			Self.colCheck = True
		Else
			Self.colCheck = False
			For Local i:Int = 0 To (cc-1)
				If collWith[i] = True Then
					Self.colCheck = True
					Exit
				Endif
			Next
		Endif
	End
	'-----------------------------------------------------------------------------
'summery:Sets the data object of this object.
	Method SetDataObj:Void (obj:Object)
		Self.dataObj = obj
	End	
	'-----------------------------------------------------------------------------
'summery:Activate horizontal and vertical image flip.
	Method SetFlip:Void (vf:Bool,hf:Bool)
		Self.isFlipV = vf
		Self.isFlipH = hf
	End
	'-----------------------------------------------------------------------------
'summery:Activate horizontal image flip.
	Method SetFlipH:Void (hf:Bool)
		Self.isFlipH = hf
	End
	'-----------------------------------------------------------------------------
'summery:Activate vertical image flip.
	Method SetFlipV:Void (vf:Bool)
		Self.isFlipV = vf
	End
	'-----------------------------------------------------------------------------
'summery:Set the objects friction.
	Method SetFriction:Void (newFriction:Float, relative:Int = False )
		If relative = True
			friction += newFriction
		Else
			friction = newFriction
		Endif
	End	
	'-----------------------------------------------------------------------------
'summery:Set the objects group ID.
	Method SetGroupID:Void (groupId:Int)
		Self.groupID = groupId
	End	
	'-----------------------------------------------------------------------------
#Rem
'summery:Set the handle/hotspot of an object.
'The handle determines the relative position of the objects hotspot (images, primitives). 
'A handle of 0.5/0.5 is in the center of the object. A handle of 0.0/0.0 is at the top left corner.
#End
	Method SetHandle:Void (hx:Float, hy:Float )
		Self.handleX = hx
		Self.handleY = hy
		internal_RotateSpriteCol(Self)
	End	
	'-----------------------------------------------------------------------------
#Rem
'summery:Set the height of an object.
The stored height is the result of the given parameter divided by the current Y scale factor.
#End
	Method SetHeight:Void (height:Float )
		Self.h = height/scaleY
		internal_RotateSpriteCol(Self)
	End	
	'-----------------------------------------------------------------------------
'summery:Set the object ID.
	Method SetID:Void (i:Int )
		Self.id = i
	End	
	'------------------------------------------
'summery:Set the layer of an object.
	Method SetLayer:Void(newLayer:ftLayer)
		If Self.layer <> Null Then
			'Self.layer.objList.Remove(Self)
			Self.layerNode.Remove()      '1.2.1
		Endif
		
		If newLayer <> Null Then
			Self.layerNode = newLayer.objList.AddLast(Self)     '1.2.1
		Endif
		Self.layer = newLayer
	End
	'-----------------------------------------------------------------------------
'summery:Set the maximum speed of an object.
	Method SetMaxSpeed:Void (maxSpeed:Float )
		Self.speedMax = maxSpeed
	End
	'-----------------------------------------------------------------------------
'summery:Set the minimum speed of an object.
	Method SetMinSpeed:Void (minSpeed:Float )
		Self.speedMin = minSpeed
	End
	'-----------------------------------------------------------------------------
'summery:Set the name of an object.
	Method SetName:Void (newName:String )
		Self.name = newName
	End	
	'------------------------------------------
'summery:Set the parent of an object.
	Method SetParent:Void(newParent:ftObject)
		If Self.parentObj <> Null Then
			'Self.parentObj.childObjList.Remove(Self)
			Self.parentNode.Remove()       '1.2.1
			Self.parentNode = Null
		Endif
		If newParent <> Null Then
			Self.parentNode = newParent.childObjList.AddLast(Self)
		Endif
		Self.parentObj = newParent
	End
	'-----------------------------------------------------------------------------
'summery:Set the objects X/Y position.
	Method SetPos:Void (x:Float, y:Float, relative:Int = False )
		Local xd:Float
		Local yd:Float
		If relative = True Then
			For Local child := Eachin childObjList
				child.SetPos(x, y, relative)
			Next
		Else
			For Local child := Eachin childObjList
				xd = Self.xPos - child.xPos
				yd = Self.yPos - child.yPos
				child.SetPos(x-xd, y-yd, relative)
			Next
		Endif
		If relative = True
			xPos = xPos + x
			yPos = yPos + y
		Else
			xPos = x
			yPos = y
		Endif
	End
	'-----------------------------------------------------------------------------
'summery:Set the X-position of an object.
	Method SetPosX:Void (x:Float, relative:Int = False )
		Local xd:Float
		If relative = True Then
			For Local child := Eachin childObjList
				child.SetPosX(x, relative)
			Next
		Else
			For Local child := Eachin childObjList
				xd = Self.xPos - child.xPos
				child.SetPosX(x-xd, relative)
			Next
		Endif
		If relative = True
			xPos = xPos + x
		Else
			xPos = x
		Endif
	End
	'-----------------------------------------------------------------------------
'summery:Set the Y-position of an object.
	Method SetPosY:Void (y:Float, relative:Int = False )
		Local yd:Float
		If relative = True Then
			For Local child := Eachin childObjList
				child.SetPosY(y, relative)
			Next
		Else
			For Local child := Eachin childObjList
				yd = Self.yPos - child.yPos
				child.SetPosY(y-yd, relative)
			Next
		Endif
		If relative = True
			yPos = yPos + y
		Else
			yPos = y
		Endif
	End
	'-----------------------------------------------------------------------------
'summery:Set the Z-position of an object.
	Method SetPosZ:Void (z:Float, relative:Int = False )
		Local zd:Float
		If relative = True Then
			For Local child := Eachin childObjList
				child.SetPosZ(z, relative)
			Next
		Else
			For Local child := Eachin childObjList
				zd = Self.zPos - child.zPos
				child.SetPosZ(z-zd, relative)
			Next
		Endif
		If relative = True
			zPos = zPos + z
		Else
			zPos = z
		Endif
	End
	'-----------------------------------------------------------------------------
'summery:Set the radius of an object.
	Method SetRadius:Void (newRadius:Float, relative:Int = False )
		If relative = True
			radius += newRadius/scaleX
		Else
			radius = newRadius/scaleX
		Endif
	End	
	'-----------------------------------------------------------------------------
'summery:Sets the area of an objects texture that is to be drawn.
	Method SetRenderArea:Void (renderOffsetX:Float, renderOffsetY:Float, renderWidth:Float, renderHeight:Float)
		If renderOffsetX + renderWidth <= w Then
			rox = renderOffsetX
			rw = renderWidth
		Else
			rox = 0.0
			rw = w
		Endif
		If renderOffsetY + renderHeight <= h Then
			roy = renderOffsetY
			rh = renderHeight
		Else
			roy = 0.0
			rh = h
		Endif
	End
	'-----------------------------------------------------------------------------
'summery:Set the scale of an object.
	Method SetScale:Void (newScale:Float, relative:Int = False )
		Local sd:Float
		If relative = True Then
			For Local child := Eachin childObjList
				child.SetScale(newScale, relative)
			Next
		Else
			For Local child := Eachin childObjList
				sd = Self.scaleX - child.scaleX
				child.SetScale(newScale-sd, relative)
			Next
		Endif
		If relative = True
			scaleX += newScale
			scaleY += newScale
		Else
			scaleX = newScale
			scaleY = newScale
		Endif
		internal_RotateSpriteCol(Self)
	End
	'-----------------------------------------------------------------------------
'summery:Sets the X scale factor (width) of the object.
	Method SetScaleX:Void (newScale:Float, relative:Int = False )
		Local sd:Float
		If relative = True Then
			For Local child := Eachin childObjList
				child.SetScaleX(newScale, relative)
			Next
		Else
			For Local child := Eachin childObjList
				sd = Self.scaleX - child.scaleX
				child.SetScaleX(newScale-sd, relative)
			Next
		Endif
		If relative = True
			scaleX += newScale
		Else
			scaleX = newScale
		Endif
		internal_RotateSpriteCol(Self)
	End
	'-----------------------------------------------------------------------------
'summery:Sets the Y scale factor (height) of the object.
	Method SetScaleY:Void (newScale:Float, relative:Int = False )
		Local sd:Float
		If relative = True Then
			For Local child := Eachin childObjList
				child.SetScaleY(newScale, relative)
			Next
		Else
			For Local child := Eachin childObjList
				sd = Self.scaleY - child.scaleY
				child.SetScaleY(newScale-sd, relative)
			Next
		Endif
		If relative = True
			scaleY += newScale
		Else
			scaleY += newScale
		Endif
		internal_RotateSpriteCol(Self)
	End
	'-----------------------------------------------------------------------------
'summery:Set the speed of an object. If an angle is given, the speed will be added in that direction. If not, then in the objects angle.
	Method SetSpeed:Void (newSpeed:Float, ang:Float=9876.5)
	    Local a:Float
	    Local a2:Float
	
	    If ang = 9876.5 Then
	        a = Self.angle
	    Else
	        a = ang
	    Endif
	    a2 = a
		If newSpeed > speedMax Then newSpeed = speedMax
		If newSpeed < speedMin Then newSpeed = speedMin
	
	    speedX = Sin(a) * newSpeed
	    speedY = -Cos(a) * newSpeed
	
	    a= ATan2( speedY, speedX )+90.0
	    If a < 0.0 Then
	        a = a + 360.0
	    Else
	        If a > 360.0 Then
	            a = a - 360.0
	        Endif
	    Endif
	    'speedAngle = a
	    speedAngle = a2 
	    'speed = Sqrt(speedX * speedX + speedY * speedY)
	    speed = newSpeed
'Print("speed: "+speed+"   sp: "+sp+"   angle: "+speedAngle+"   ang: "+a)
		If speed > speedMax Then speed = speedMax
	End 
	'-----------------------------------------------------------------------------
'summery:Set the objects speed angle.
	Method SetSpeedAngle:Void (newAngle:Float)
		If newAngle < 0.0 Then
	     	newAngle = newAngle + 360.0
		Else
	    		If newAngle > 360.0 Then
	         		newAngle = newAngle - 360.0
	    		Endif
		Endif
		speedX =  Sin(newAngle) * Self.speed
		speedY = -Cos(newAngle) * Self.speed
		speedAngle = newAngle
	End 
	'-----------------------------------------------------------------------------
'summery:Set the objects X speed..
	Method SetSpeedX:Void (newSpeed:Float)
	    	Local a:Float
	    	speedX = Min(newSpeed, speedMax)
	    	a = ATan2( speedY, speedX ) + 90.0
	    	If a < 0.0 Then
	        	a = a + 360.0
	    	Else
		     	If a > 360.0 Then
		          	a = a - 360.0
		     	Endif
	    	Endif
		speedAngle = a 
		speed = Sqrt(speedX * speedX + speedY * speedY)
		If speed > speedMax Then speed = speedMax
	End 
	'-----------------------------------------------------------------------------
'summery:Set the objects Y speed..
	Method SetSpeedY:Void (newSpeed:Float)
	    	Local a:Float
	    	speedY = Min(newSpeed,speedMax)
	    	a = ATan2( speedY, speedX )+90.0
	    	If a < 0.0 Then
	        	a = a + 360.0
	    	Else
	     	If a > 360.0 Then
	          	a = a - 360.0
	     	Endif
	    	Endif
		speedAngle = a 
		speed = Sqrt(speedX * speedX + speedY * speedY)
		If speed > speedMax Then speed = speedMax
	End 
	'-----------------------------------------------------------------------------
'summery:Set the objects spin speed.
	Method SetSpin:Void (newSpin:Float, relative:Int = False )
		If relative = True
			speedSpin = speedSpin + newSpin
		Else
			speedSpin = newSpin
		Endif
	End	
	'-----------------------------------------------------------------------------
'summery:Set the objects tag field.
	Method SetTag:Void (t:Int )
		Self.tag = t
	End	
	'-----------------------------------------------------------------------------
'summery:Set the text of an object.
	Method SetText:Void (t:String )
		Local linLen:Int
		text = t
		Local lines:String[] = t.Split("~n")
		linLen = lines.Length()
		If (Self.type = ftEngine.otText Or Self.type = ftEngine.otTextMulti) Then
			If linLen <= 1 And 
				Self.type = ftEngine.otText
				w = Self.objFont.Length(t)
			Else
				Self.type = ftEngine.otTextMulti
				Self.w = 0
				For Local _y:Int = 1 To linLen
					w = Max(Self.w, Float(Self.objFont.Length(lines[_y-1])))
				Next
			Endif
			Self.h = Self.objFont.lineHeight * linLen
			Self.rh = Self.h
			Self.rw = Self.w
			Self.radius = Max(Self.h, Self.w)/2.0
		Endif
	End	
	'-----------------------------------------------------------------------------
'summery:Sets the ID of the tiles texture map, at the given map row and column, starting from zero.
	Method SetTileID:Void(column:Int, row:Int, id:Int)
		Local pos:Int = column+row*Self.tileCountX
		If pos < 0 Then 
			pos = 0
		Elseif pos > (Self.tileCount-1) Then
			pos = Self.tileCount - 1
		Endif
		Self.tileMap[pos].tileID = id
	End
	'-----------------------------------------------------------------------------
'summery:Sets the ID of the tiles texture, at the given canvas coordinates, starting from zero.

	Method SetTileIDAt:Void(xp:Int,yp:Int, id:Int=-1)
		Local left2:Float, right2:Float, top2:Float, bottom2:Float
		Local tlW:Float, tlH:Float, tlxPos:Float, tlyPos:Float
		Local ytX:Int, ytY:Int, tilePos:Int, tileIDx:Int
		
		Local _cw:Float = engine.GetCanvasWidth()
		Local _ch:Float = engine.GetCanvasHeight()
		
		Local xoff:Float = Self.layer.xPos-Self.engine.camX
		Local yoff:Float = Self.layer.yPos-Self.engine.camY
		'tempScaleX = tempScaleX + Self.tileModSX
		'tempScaleY = tempScaleY + Self.tileModSY
		
		tlW = Self.tileSizeX * Self.scaleX
		tlH = Self.tileSizeY * Self.scaleY
		Local tlW2:Float = tlW/2.0
		Local tlH2:Float = tlH/2.0
		
		'Determine the first and last xCoordinate
		Local xFirst:Int = 1
		Local xLast:Int = Self.tileCountX
		
		For ytX = 1 To Self.tileCountX
			tlxPos = xoff+xPos+Self.tileMap[ytX-1].xOff * Self.scaleX
			If (tlxPos+tlW2)>=0 And (tlxPos-tlW2)<=_cw Then 
				xFirst = ytX
				Exit
			Endif
		Next
		
		For ytX = (xFirst+1) To Self.tileCountX
			tlxPos = xoff+xPos+Self.tileMap[ytX-1].xOff * Self.scaleX
			If (tlxPos+tlW2)<0 Or (tlxPos-tlW2)>_cw Then 
				xLast = ytX-1
				Exit
			Endif
		Next
		
		'Determine the first and last yCoordinate
		Local yFirst:Int = 1
		Local yLast:Int = Self.tileCountY
		
		For ytY = 1 To Self.tileCountY
			tilePos = (ytY-1)*Self.tileCountX
			tlyPos = yoff+yPos+Self.tileMap[tilePos].yOff * Self.scaleY
			If (tlyPos+tlH2)>=0 And (tlyPos-tlH2)<=_ch Then 
				yFirst = ytY
				Exit
			Endif
		Next
		
		For ytY = (yFirst+1) To Self.tileCountY
			tilePos = (ytY-1)*Self.tileCountX
			tlyPos = yoff+yPos+Self.tileMap[tilePos].yOff * Self.scaleY
			If (tlyPos+tlH2)<0 Or (tlyPos-tlH2)>_ch Then 
				yLast = ytY-1
				Exit
			Endif
		Next
		
		For ytY = yFirst To yLast
			For ytX = xFirst To xLast							
				tilePos = (ytX-1)+(ytY-1)*Self.tileCountX
				tileIDx = Self.tileMap[tilePos].tileID

				'tlxPos = xoff+xPos+Self.tileMap[tilePos].xOff * Self.scaleX
				'tlyPos = yoff+yPos+Self.tileMap[tilePos].yOff * Self.scaleY
				
				tlxPos = Self.xPos + Self.tileMap[tilePos].xOff * Self.scaleX
				tlyPos = Self.yPos + Self.tileMap[tilePos].yOff * Self.scaleY
				left2   = tlxPos - (tlW)/2.0
				right2  = left2 + tlW
				top2    = tlyPos - (tlH)/2.0
				bottom2 = top2 + tlH
				If (yp < top2) Then Continue
				If (yp > bottom2) Then Continue
				If (xp < left2) Then Continue
				If (xp > right2) Then Continue
				Self.tileMap[tilePos].tileID = id 
				Return 
			Next
		Next	
	End

#rem
	Method SetTileIDAt_old:Int(xp:Int, yp:Int, id:Int)
		Local left2:Float, right2:Float, top2:Float, bottom2:Float
		Local tlW:Float, tlH:Float, tlxPos:Float, tlyPos:Float
		Local ytX:Int, ytY:Int, tilePos:Int
		      
		      
		tlW = Self.tileSizeX * Self.scaleX
		tlH = Self.tileSizeY * Self.scaleY
		For ytY = 1 To Self.tileCountY
			For ytX = 1 To Self.tileCountX
			
				tilePos = (ytX-1)+(ytY-1)*Self.tileCountX
				tlxPos = Self.xPos + Self.tileMap[tilePos].xOff * Self.scaleX
				tlyPos = Self.yPos + Self.tileMap[tilePos].yOff * Self.scaleY
				left2   = tlxPos - (tlW)/2.0
				right2  = left2 + tlW
				top2    = tlyPos - (tlH)/2.0
				bottom2 = top2 + tlH
				If (yp < top2) Then Continue
				If (yp > bottom2) Then Continue
				If (xp < left2) Then Continue
				If (xp > right2) Then Continue
				Self.tileMap[tilePos].tileID = id 
				Return 0 
			Next
		Next
		Return 0
	End
#End	
	'-----------------------------------------------------------------------------
'summery:Sets the tile scale modification factors which are used during rendering.
	Method SetTileSModXY:Void(xMod:Float, yMod:Float)
		Self.tileModSX = xMod
		Self.tileModSY = yMod
	End
	'-----------------------------------------------------------------------------
'summery:Set the objects touch mode.
	Method SetTouchMode:Void (touch:Int)
		touchMode = touch
	End
	'-----------------------------------------------------------------------------
'summery:Set if an object will wrap around the screen borders automatically.
	Method SetWrapScreen:Void (ws:Bool )
		Self.isWrappingX = ws
		Self.isWrappingY = ws
	End	
	'-----------------------------------------------------------------------------
'summery:Set if an object will wrap around the left/right screen borders automatically.
	Method SetWrapScreenX:Void (wsx:Bool )
		Self.isWrappingX = wsx
	End	
	'-----------------------------------------------------------------------------
'summery:Set if an object will wrap around the top/bottom screen borders automatically.
	Method SetWrapScreenY:Void (wsy:Bool )
		Self.isWrappingY = wsy
	End	
	'-----------------------------------------------------------------------------
'summery:Set if an object is visible.
	Method SetVisible:Void (visible:Bool = True )
		isVisible = visible
	End
	'-----------------------------------------------------------------------------
#Rem
'summery:Set the width of an object.
The stored width is the result of the given parameter divided by the current X scale factor.
#End
	Method SetWidth:Void (width:Float )
		Self.w = width/scaleX
		internal_RotateSpriteCol(Self)
	End	
	'-----------------------------------------------------------------------------
'#DOCOFF#	
	Method WrapScreenX:Void()
		If xPos < 0 Then Self.SetPos(engine.canvasWidth,0,True)
		If xPos > engine.canvasWidth Then Self.SetPos(-engine.canvasWidth,0,True)
	End
	'-----------------------------------------------------------------------------
	Method WrapScreenY:Void()
		If yPos < 0 Then Self.SetPos(0,engine.canvasHeight,True)
		If yPos > engine.canvasHeight Then Self.SetPos(0,-engine.canvasHeight,True)
	End
'#DOCON#	
	'------------------------------------------
'summery:Update an object with the given updatespeed factor.
	Method Update:Void(delta:Float=1.0)

		If isActive = True And deleted = False Then
			If engine.isPaused = False Then
				If isAnimated = True
					Self.animTime += delta * engine.timeScale
					If (Self.animTime > (Self.frameEnd*Self.frameTime)) Then Self.animTime -= (Self.frameLength*Self.frameTime)
				Endif
	
			    'Local currSpeedAngle:Float = speedAngle
			    Local currSpeed:Float = speed
			    Local currFriction:Float = friction * delta * engine.timeScale
			    If currSpeed >= 0 Then
				    currSpeed = currSpeed - currFriction
				    If currSpeed < currFriction Then currSpeed = 0.0
				
				    speed  = currSpeed
				    speedX = Sin(speedAngle) * currSpeed
				    speedY = -Cos(speedAngle) * currSpeed
					If speed <> 0 Then Self.SetPos(speedX * delta * engine.timeScale, speedY * delta * engine.timeScale, True)	
				Else
			    	currSpeed = currSpeed + currFriction
				    If currSpeed > currFriction Then currSpeed = 0.0
				
				    speed  = currSpeed
				    speedX = Sin(speedAngle) * currSpeed
				    speedY = -Cos(speedAngle) * currSpeed
					If speed <> 0 Then Self.SetPos(speedX * delta * engine.timeScale, speedY * delta * engine.timeScale, True)	
				Endif
			    If speedSpin  <> 0 Then
			        Local absSpeedSpin:Float = speedSpin
			        If absSpeedSpin < 0 Then absSpeedSpin = absSpeedSpin * -1
			        If absSpeedSpin < currFriction Then
			            speedSpin = 0.0
			        Else
			           If speedSpin > 0 Then
			                speedSpin = speedSpin - currFriction
			           Else
			                speedSpin = speedSpin + currFriction
			           Endif
			        Endif
			
			    Endif
				If speedSpin <> 0 Then	Self.SetAngle(speedSpin * delta * engine.timeScale, True)
	
				If Self.isWrappingX Then Self.WrapScreenX()
				If Self.isWrappingY Then Self.WrapScreenY()
			Endif
			For Local child := Eachin childObjList 
				If child.isActive Then child.Update(delta)
			Next
			For Local trans:ftTrans = Eachin transitionList
				trans.Update()
			Next
			For Local timer:ftTimer = Eachin timerList
				timer.Update()
			Next
			If engine.isPaused = False Then
				If Self.onUpdateEvent = True Then engine.OnObjectUpdate(Self)
			Endif
		Endif
		Self.CleanupLists()
		
	End
  '*****************************************************************
'#DOCOFF#
	'-----------------------------------------------------------------------------
	Method internal_between:Bool(v:Float,l:Float,h:Float)
		If v >= l And v <= h Then Return True
		Return False
	End

	'-----------------------------------------------------------------------------
  Method internal_Collided_CrossDistance:Float(l1:tLine2D, l2:tLine2D, safetyZone:Float)
      '  returns distance between p1 and crossing of two lines, -1 when no cross found
      Local result:Float  '  cross not found
      Local q2:Float
      Local t2:Float
      Local p1start:tPointS = New tPointS
Local p1end:tPointS = New tPointS
Local p2start:tPointS = New tPointS
Local p2end:tPointS = New tPointS
      Local t:Float
      Local k1:Float
Local k2:Float
      Local xp:Float
Local yp:Float
      Local minx1:Float
      Local maxx1:Float
      Local miny1:Float
      Local maxy1:Float
      Local minx2:Float
      Local maxx2:Float
      Local miny2:Float
      Local maxy2:Float
      Local tmp:Float
      Local q1:Float

      result = -1
      p1start.x = l1.p1.x
      p1start.y = l1.p1.y

      p1end.x = l1.p2.x
      p1end.y = l1.p2.y

      p2start.x = l2.p1.x
      p2start.y = l2.p1.y

      p2end.x = l2.p2.x
      p2end.y = l2.p2.y

      t = p1end.x - p1start.x

      'k1 = IIF(t, (p1end.Y - p1start.Y) / t, 100000.0     )
	If t <> 0 Then
		k1 = (p1end.y - p1start.y) / t
	Else
		k1 = 100000.0 
	Endif
      q1 = p1start.x - (k1 * p1start.x)

      t = p2end.x - p2start.x

      'k2 = IIF(t, (p2end.Y - p2start.Y) / t, 100000.0     )
	If t <> 0 Then
		k2 = (p2end.y - p2start.y) / t
	Else
		k2 = 100000.0 
	Endif

      q2 = p2start.y - (k2 * p2start.x)
      t2 = k2 - k1


      If Abs(t2) < 0.0001 Then
        yp = 100000.0
        xp = 100000.0
      Else
        yp = (q1*k2-q2*k1) / t2
        xp = (q1-q2) / t2
      Endif

      '  special cases
      If (p1end.x - p1start.x) = 0 Then
        xp = p1start.x
        yp = k2*xp+q2
      Endif

      If (p2end.x - p2start.x) = 0 Then
        xp = p2start.x
        yp = k1*xp+q1
      Endif
      '  end of special cases

      minx1 = Min(p1start.x, p1end.x)
      maxx1 = Max(p1start.x, p1end.x)
      miny1 = Min(p1start.y, p1end.y)
      maxy1 = Max(p1start.y, p1end.y)
      minx2 = Min(p2start.x, p2end.x)
      maxx2 = Max(p2start.x, p2end.x)
      miny2 = Min(p2start.y, p2end.y)
      maxy2 = Max(p2start.y, p2end.y)


      If  xp + safetyZone < minx1  Or
          xp - safetyZone > maxx1  Or
          yp + safetyZone < miny1  Or
          yp - safetyZone > maxy1  Or
          xp + safetyZone < minx2  Or
          xp - safetyZone > maxx2  Or
          yp + safetyZone < miny2  Or
          yp - safetyZone > maxy2  Then

          result = -1.0

      Else
          tmp = Pow((xp-p1start.x),2)
          tmp = tmp + Pow((yp-p1start.y),2)
          tmp = Sqrt(tmp)
          result = tmp
      Endif

      Return result

  End
	'-----------------------------------------------------------------------------
	Method internal_Collided_IsIn:Bool(p:tPointS, a:tPointS, b:tPointS, d:tPointS)
		Local v:tPointS = New tPointS
		Local v1:tPointS = New tPointS
		Local v2:tPointS = New tPointS

      	v.x = p.x - a.x
      	v.y = p.y - a.y

		v1.x = b.x - a.x
		v1.y = b.y - a.y
		v2.x = d.x - a.x
      	v2.y = d.y - a.y

		If internal_between(internal_Vec2DotProduct(v, v1), 0, internal_Vec2DotProduct(v1, v1)) And internal_between(internal_Vec2DotProduct(v, v2), 0, internal_Vec2DotProduct(v2, v2)) Then Return True
		Return False
	End
	
	
	
	  '-----------------------------------------------------------------------------
	  Method internal_Circle2Box:Bool(sp1:ftObject, sp2:ftObject)
	      Local rf:Float
	      Local bp1:tPointS = New tPointS
	      Local bp2:tPointS = New tPointS
	      Local bp3:tPointS = New tPointS
	      Local bp4:tPointS = New tPointS
	      
	      Local sp1X:Float, sp1Y:Float
	      sp1X = sp1.xPos + sp1.hOffX
	      sp1Y = sp1.yPos + sp1.hOffY
	
	      If internal_PointInsidePolygon(sp2, sp1X, sp1Y) Then Return True
	
	      rf = sp1.radius * sp1.scaleX * sp1.collScale
	
	      bp1.x = sp2.x1c + sp2.xPos
	      bp1.y = sp2.y1c + sp2.yPos
	
	      bp2.x = sp2.x2c + sp2.xPos
	      bp2.y = sp2.y2c + sp2.yPos
	
	      bp3.x = sp2.x3c + sp2.xPos
	      bp3.y = sp2.y3c + sp2.yPos
	
	      bp4.x = sp2.x4c + sp2.xPos
	      bp4.y = sp2.y4c + sp2.yPos

	      If internal_Line2Circle(bp1.x, bp1.y, bp2.x, bp2.y, sp1X, sp1Y, rf) Then Return True
	      If internal_Line2Circle(bp2.x, bp2.y, bp3.x, bp3.y, sp1X, sp1Y, rf) Then Return True
	      If internal_Line2Circle(bp3.x, bp3.y, bp4.x, bp4.y, sp1X, sp1Y, rf) Then Return True
	      If internal_Line2Circle(bp4.x, bp4.y, bp1.x, bp1.y, sp1X, sp1Y, rf) Then Return True
	      Return False
	  End

	  '-----------------------------------------------------------------------------
	  Method internal_Circle2Circle:Bool(sp1:ftObject, sp2:ftObject)
	      Local xf:Float, yf:Float, rf:Float
	
	      xf = (sp1.xPos + sp1.hOffX) - (sp2.xPos + sp2.hOffX)
	      xf *= xf
	      yf = (sp1.yPos + sp1.hOffY) - (sp2.yPos + sp2.hOffY)
	      yf *= yf
	      rf = ( sp1.radius * sp1.scaleX  * sp1.collScale) + ( sp2.radius * sp2.scaleX * sp2.collScale )
	      rf *= rf

	      If (xf+yf) < rf Then Return True
	
	      Return False
	  End
	
	  '-----------------------------------------------------------------------------
	  Method internal_Circle2CircleInBox:Bool(sp1:ftObject, sp2:ftObject)
	      Local xf:Float, yf:Float, rf:Float
	
	      xf = (sp1.xPos + sp1.hOffX) - (sp2.xPos + sp2.hOffX)
	      xf *= xf
	      yf = (sp1.yPos + sp1.hOffY) - (sp2.yPos + sp2.hOffY)
	      yf *= yf
	      rf = (sp1.radius * sp1.scaleX + sp2.radius * sp2.scaleX) * 1.42
	      rf *= rf

	      If (xf+yf) < rf Then Return True
	
	      Return False
	  End

	  '-----------------------------------------------------------------------------
	  Method internal_Circle2LineObj:Bool(sp1:ftObject, sp2:ftObject)
	      Local rf:Float
	      Local bp1:tPointS = New tPointS
	      Local bp2:tPointS = New tPointS
	      
	      Local sp1X:Float, sp1Y:Float
	      sp1X = sp1.xPos + sp1.hOffX
	      sp1Y = sp1.yPos + sp1.hOffY
	
	      rf = sp1.radius * sp1.scaleX * sp1.collScale
	
	      bp1.x = sp2.x1c + sp2.xPos
	      bp1.y = sp2.y1c + sp2.yPos
	
	      bp2.x = sp2.x2c + sp2.xPos
	      bp2.y = sp2.y2c + sp2.yPos
	
	      If internal_Line2Circle(bp1.x, bp1.y, bp2.x, bp2.y, sp1X, sp1Y, rf) Then Return True
	      Return False
	  End

	  '-----------------------------------------------------------------------------
	  Method internal_Bound2Bound:Bool(sp1:ftObject, sp2:ftObject)
	      Local left1:Float, left2:Float, right1:Float, right2:Float, top1:Float, top2:Float, bottom1:Float, bottom2:Float, h:Float, w:Float
	
	      
		  left1   = sp1.xPos + sp1.hOffX - (sp1.w*sp1.scaleX * sp1.collScale)/2.0
	      right1  = left1 + sp1.w*sp1.scaleX

	      top1    = sp1.yPos + sp1.hOffY - (sp1.h*sp1.scaleY * sp1.collScale)/2.0
	      bottom1 = top1 + sp1.h*sp1.scaleY
	
		  left2   = sp2.xPos + sp2.hOffX - (sp2.w*sp2.scaleX * sp2.collScale)/2.0
	      right2  = left2 + sp2.w*sp2.scaleX

	      top2    = sp2.yPos + sp2.hOffY - (sp2.h*sp2.scaleY * sp2.collScale)/2.0
	      bottom2 = top2 + sp2.h*sp2.scaleY


	      If (bottom1 < top2) Then Return False
	      If (top1 > bottom2) Then Return False
	      If (right1 < left2) Then Return False
	      If (left1 > right2) Then Return False
	      Return True
	  End
	  '-----------------------------------------------------------------------------
	  Method internal_Box2Box:Bool(pSpriteA:ftObject, pSpriteB:ftObject)
		' -- Corner points
		Local ap1:tPointS = New tPointS
		Local ap2:tPointS = New tPointS 
		Local ap3:tPointS = New tPointS 
		Local ap4:tPointS = New tPointS
		Local bp1:tPointS = New tPointS
		Local bp2:tPointS = New tPointS 
		Local bp3:tPointS = New tPointS 
		Local bp4:tPointS = New tPointS
		
		Local a1p1:tPointS = New tPointS
		Local a1p2:tPointS = New tPointS
		Local a2p1:tPointS = New tPointS
		Local a2p2:tPointS = New tPointS
		Local a3p1:tPointS = New tPointS
		Local a3p2:tPointS = New tPointS
		Local a4p1:tPointS = New tPointS
		Local a4p2:tPointS = New tPointS

		Local b1p1:tPointS = New tPointS
		Local b1p2:tPointS = New tPointS
		Local b2p1:tPointS = New tPointS
		Local b2p2:tPointS = New tPointS
		Local b3p1:tPointS = New tPointS
		Local b3p2:tPointS = New tPointS
		Local b4p1:tPointS = New tPointS
		Local b4p2:tPointS = New tPointS

		' -- Each rectangle defined by 4 lines - 0..3
		Local a:tLine2D[] = [New tLine2D,New tLine2D,New tLine2D,New tLine2D]
		Local b:tLine2D[] = [New tLine2D,New tLine2D,New tLine2D,New tLine2D]
		Local la:tLine2D = New tLine2D
		
		Local lb:tLine2D = New tLine2D
		If internal_Circle2CircleInBox(pSpriteA  , pSpriteB) = False Then Return False
		'internal_RotateSpriteCol(pSpriteA)
		'internal_RotateSpriteCol(pSpriteB)

		' -- Sprite A
		ap1.x = pSpriteA.x1c + pSpriteA.xPos
		ap1.y = pSpriteA.y1c + pSpriteA.yPos
		
		ap2.x = pSpriteA.x2c + pSpriteA.xPos
		ap2.y = pSpriteA.y2c + pSpriteA.yPos
		
		ap3.x = pSpriteA.x3c + pSpriteA.xPos
		ap3.y = pSpriteA.y3c + pSpriteA.yPos
		
		ap4.x = pSpriteA.x4c + pSpriteA.xPos
		ap4.y = pSpriteA.y4c + pSpriteA.yPos
		
		
		' -- Sprite B
		bp1.x = pSpriteB.x1c + pSpriteB.xPos
		bp1.y = pSpriteB.y1c + pSpriteB.yPos
		
		bp2.x = pSpriteB.x2c + pSpriteB.xPos
		bp2.y = pSpriteB.y2c + pSpriteB.yPos
		
		bp3.x = pSpriteB.x3c + pSpriteB.xPos
		bp3.y = pSpriteB.y3c + pSpriteB.yPos
		
		bp4.x = pSpriteB.x4c + pSpriteB.xPos
		bp4.y = pSpriteB.y4c + pSpriteB.yPos


		' -- Test for corners inside first - faster
		If internal_Collided_IsIn(bp1, ap1, ap2, ap4) Then Return True
		If internal_Collided_IsIn(bp2, ap1, ap2, ap4) Then Return True
		If internal_Collided_IsIn(bp3, ap1, ap2, ap4) Then Return True
		If internal_Collided_IsIn(bp4, ap1, ap2, ap4) Then Return True
		
		If internal_Collided_IsIn(ap1, bp1, bp2, bp4) Then Return True
		If internal_Collided_IsIn(ap2, bp1, bp2, bp4) Then Return True
		If internal_Collided_IsIn(ap3, bp1, bp2, bp4) Then Return True
		If internal_Collided_IsIn(ap4, bp1, bp2, bp4) Then Return True
		
		
		' -- Getting pointers
		a1p1 = a[0].p1
		a1p2 = a[0].p2
		
		a2p1 = a[1].p1
		a2p2 = a[1].p2
		
		a3p1 = a[2].p1
		a3p2 = a[2].p2
		
		a4p1 = a[3].p1
		a4p2 = a[3].p2
		
		b1p1 = b[0].p1
		b1p2 = b[0].p2
		
		b2p1 = b[1].p1
		b2p2 = b[1].p2
		
		b3p1 = b[2].p1
		b3p2 = b[2].p2
		
		b4p1 = b[3].p1
		b4p2 = b[3].p2

		' -- Box A
		a1p1.x = ap1.x
		a1p1.y = ap1.y
		a1p2.x = ap2.x
		a1p2.y = ap2.y
		
		a2p1.x = ap2.x
		a2p1.y = ap2.y
		a2p2.x = ap3.x
		a2p2.y = ap3.y
		
		a3p1.x = ap3.x
		a3p1.y = ap3.y
		a3p2.x = ap4.x
		a3p2.y = ap4.y
		
		a4p1.x = ap4.x
		a4p1.y = ap4.y
		a4p2.x = ap1.x
		a4p2.y = ap1.y
		
		' -- Box B
		b1p1.x = bp1.x
		b1p1.y = bp1.y
		b1p2.x = bp2.x
		b1p2.y = bp2.y
		
		b2p1.x = bp2.x
		b2p1.y = bp2.y
		b2p2.x = bp3.x
		b2p2.y = bp3.y
		
		b3p1.x = bp3.x
		b3p1.y = bp3.y
		b3p2.x = bp4.x
		b3p2.y = bp4.y
		
		b4p1.x = bp4.x
		b4p1.y = bp4.y
		b4p2.x = bp1.x
		b4p2.y = bp1.y

		' -- Test for edge intersection
		For Local i:Int = 0 To 3
			For Local j:Int = 0 To 3
		   		la = a[i]
		   		lb = b[j]
		   		If internal_Collided_CrossDistance(la, lb, 0) <> -1 Then
		     		Return True
		   		Endif
			Next
		Next
		Return False
	  End
	  '-----------------------------------------------------------------------------
	  Method internal_Box2Circle:Bool(sp2:ftObject, sp1:ftObject)
	      Local rf:Float
	      Local bp1:tPointS = New tPointS
	      Local bp2:tPointS = New tPointS
	      Local bp3:tPointS = New tPointS
	      Local bp4:tPointS = New tPointS	

	      Local sp1X:Float, sp1Y:Float
	      sp1X = sp1.xPos + sp1.hOffX
	      sp1Y = sp1.yPos + sp1.hOffY
	
	      If internal_PointInsidePolygon(sp2, sp1X, sp1Y) Then Return True
	
	      rf = sp1.radius * sp1.scaleX
	
	      bp1.x = sp2.x1c + sp2.xPos
	      bp1.y = sp2.y1c + sp2.yPos
	
	      bp2.x = sp2.x2c + sp2.xPos
	      bp2.y = sp2.y2c + sp2.yPos
	
	      bp3.x = sp2.x3c + sp2.xPos
	      bp3.y = sp2.y3c + sp2.yPos
	
	      bp4.x = sp2.x4c + sp2.xPos
	      bp4.y = sp2.y4c + sp2.yPos

	      If internal_Line2Circle(bp1.x, bp1.y, bp2.x, bp2.y, sp1X, sp1Y, rf) Then Return True
	      If internal_Line2Circle(bp2.x, bp2.y, bp3.x, bp3.y, sp1X, sp1Y, rf) Then Return True
	      If internal_Line2Circle(bp3.x, bp3.y, bp4.x, bp4.y, sp1X, sp1Y, rf) Then Return True
	      If internal_Line2Circle(bp4.x, bp4.y, bp1.x, bp1.y, sp1X, sp1Y, rf) Then Return True

	      Return False
	  End


	  '-----------------------------------------------------------------------------
	  Method internal_Line2Circle:Bool(x1:Float, y1:Float, x2:Float, y2:Float, px:Float, py:Float, r:Float)
	      Local sx:Float
	      Local sy:Float
	      Local cx:Float
	      Local cy:Float
	      Local q:Float

	      sx = x2 - x1
	      sy = y2 - y1
	      q = (((px-x1) * (x2-x1)) + ((py - y1) * (y2-y1))) / ((sx*sx) + (sy*sy))
	
	      If q < 0.0 Then q = 0.0
	      If q > 1.0 Then q = 1.0
	
	      cx = ((1-q) * x1) + (q*x2)
	      cy = ((1-q) * y1) + (q*y2)
	
	      Return (internal_PointToPointDist(px,py,cx,cy) < r)
	  End

	'-----------------------------------------------------------------------------
	Method internal_isObjAt:Bool(px:Float, py:Float)
		Local txOff:Float = 0.0
		Local tyOff:Float = 0.0
		Local ret:Bool = False

		If deleted = False Then
			Select type

				Case ftEngine.otText
					Select textMode
						Case 0   'taTopLeft
							txOff = -(Float(Self.objFont.Length(Self.text))/2.0)*Self.scaleX
							tyOff = (Self.objFont.lineHeight/2.0*Self.scaleY)
							
				     	Case 1   'taTopCenter
							txOff = 0.0
							tyOff = (Self.objFont.lineHeight/2.0*Self.scaleY)
							
						Case 2   'taTopRight
							txOff = (Float(Self.objFont.Length(Self.text))/2.0)*Self.scaleX
							tyOff = (Self.objFont.lineHeight/2.0*Self.scaleY)
						
						Case 7   'taCenterLeft
							txOff = -(Float(Self.objFont.Length(Self.text))/2.0)*Self.scaleX
							tyOff = 0.0
							
				     	Case 3   'taCenterCenter
							txOff = 0.0
							tyOff = 0.0
							
						Case 4   'taCenterRight
							txOff = (Float(Self.objFont.Length(Self.text))/2.0)*Self.scaleX
							tyOff = 0.0
														
						Case 8   'taBottomLeft
							txOff = -(Float(Self.objFont.Length(Self.text))/2.0)*Self.scaleX
							tyOff = -(Self.objFont.lineHeight/2.0*Self.scaleY)
							
				     	Case 5   'taBottomCenter
							txOff = 0.0
							tyOff = -(Self.objFont.lineHeight/2.0*Self.scaleY)
							
						Case 6   'taBottomRight
							txOff = (Float(Self.objFont.Length(Self.text))/2.0)*Self.scaleX
							tyOff = -(Self.objFont.lineHeight/2.0*Self.scaleY)
						
					End
					
					Select Self.touchMode
				     	Case ftEngine.tmCircle
							ret = internal_PointInsideCircle(Self, px+txOff, py-tyOff)
							'ret = internal_PointInsidePolygon(Self, px+txOff, py-tyOff)
						Case ftEngine.tmBox
							ret = internal_PointInsidePolygon(Self, px+txOff, py-tyOff)
						Default
							ret = internal_PointInsideBound(Self, px+txOff, py-tyOff)
					End
				Default
					Select Self.touchMode
				     	Case ftEngine.tmCircle
							ret = internal_PointInsideCircle(Self, px, py)
						Case ftEngine.tmBox
							ret = internal_PointInsidePolygon(Self, px+txOff, py-tyOff)
						Default
							ret = internal_PointInsideBound(Self, px, py)
					End
			End
		Endif

		Return ret
	End

	  '-----------------------------------------------------------------------------
	  Method internal_OrbitChild:Int (angDiff:Float)
		Local parObj:ftObject = Self.parentObj
		Local childAngle:Float = parObj.GetTargetAngle(Self)
		Local childDist:Float = parObj.GetTargetDist(Self)
		Local vec:Float[] = parObj.GetVector(childDist, childAngle+angDiff)
		Self.SetPos(vec[0],vec[1])
		Return 0
	  End

	  '-----------------------------------------------------------------------------
	   Method internal_PointInsideBound:Bool(sp:ftObject, px:Float, py:Float)
	      Local t:Float, b:Float, l:Float, r:Float
	      l =  sp.xPos + sp.hOffX - (sp.w*sp.scaleX * sp.collScale)/2.0 + 1.0
	      r =  l + sp.w * (sp.scaleX * sp.collScale) - 2.0
	      t =  sp.yPos + sp.hOffY  - (sp.h*sp.scaleY * sp.collScale)/2.0 + 1.0
	      b += t + sp.h * (sp.scaleY * sp.collScale) - 2.0
		'If Self.name="PLAY" Then
		'	Print("px:"+px+"   l:"+ l +"   r:"+ r)
		'	Print("py:"+py+"   t:"+ t +"   b:"+ b)
		'Endif
	      If px < l Or px > r Or py < t Or py > b Then Return False
	      Return True
	   End
	  '-----------------------------------------------------------------------------
	   Method internal_PointInsideCircle:Bool(_sp:ftObject, _px:Float, _py:Float)
	      Local xf:Float
		  Local yf:Float
		  Local rf:Float
		  
	      xf = (_sp.xPos + _sp.hOffX - _px)
		  'Print ("xf = (_sp.xPos - _px) = "+xf)

	      xf = (xf * xf)
		  'Print ("xf = (xf * xf) = "+xf)
		  
	      yf = (_sp.yPos + _sp.hOffY - _py)
		  'Print ("yf = (_sp.yPos - _py) = "+yf)
		  
	      yf = (yf * yf)
		  'Print ("yf = (yf * yf) = "+yf)
		  
	      rf = (_sp.radius * _sp.scaleX)
		  'Print ("rf = (_sp.radius * _sp.scaleX) = "+rf)
		  
	      rf = (rf * rf)
		  'Print ("rf = (rf * rf) = "+rf)


		  'Print ("((xf+yf) < rf) = "+(xf+yf)+"<"+rf)
	      If ((xf+yf) < rf) Then Return True
	      Return False
	   End
#Rem
	  '-----------------------------------------------------------------------------
	   Method internal_PointInsidePolygon_old:Bool(sp:ftObject, px:Float, py:Float)
	       Local iangle:Float
	       Local x1:Float,x3:Float,y1:Float,y3:Float
	       Local cx:Float,cy:Float
	       Local SinVal:Float, CosVal:Float
	
	       iangle = sp.angle * 0.0174533
	       SinVal = Sin(-iangle)
	       CosVal = Cos(-iangle)
	
	       cx = px - sp.xPos
	       cy = py - sp.yPos
	
	       px =(cx*CosVal) - (cy*SinVal) + sp.xPos
	       py =(cy*CosVal) + (cx*SinVal) + sp.yPos

	       x1 =  sp.x1c + sp.xPos
	       x3 =  sp.x3c + sp.xPos
	       y1 =  sp.y1c + sp.yPos
	       y3 =  sp.y3c + sp.yPos

	       Return ((px>x1 And px<x3) And (py<y3 And py>y1))
	
	   End
#End
	  '-----------------------------------------------------------------------------
		Method internal_PointInsidePolygon:Bool(sp:ftObject, px:Float, py:Float)
			'Local iangle:Float
			'Local x1:Float,x3:Float,y1:Float,y3:Float
			Local cx:Float,cy:Float
			Local SinVal:Float, CosVal:Float
			Local t:Float, b:Float, l:Float, r:Float
	
			'iangle = sp.angle * 0.0174533
			'SinVal = Sinr(-iangle)
			'CosVal = Cosr(-iangle)
			SinVal = Sinr(-sp.angle)
			CosVal = Cosr(-sp.angle)

			cx = px - sp.xPos
			cy = py - sp.yPos
	
			px =(cx*CosVal) - (cy*SinVal) + sp.xPos
			py =(cy*CosVal) + (cx*SinVal) + sp.yPos
			
			l =  sp.xPos + sp.hOffX - (sp.w*sp.scaleX * sp.collScale)/2.0 + 1.0
			r =  l + sp.w * (sp.scaleX * sp.collScale) - 2.0
			t =  sp.yPos + sp.hOffY - (sp.h*sp.scaleY * sp.collScale)/2.0 + 1.0
			b += t + sp.h * (sp.scaleY * sp.collScale) - 2.0

			If px < l Or px > r Or py < t Or py > b Then Return False
			Return True
	   End
	  '-----------------------------------------------------------------------------
	  Method internal_PointToPointDist:Float( x1:Float, y1:Float, x2:Float, y2:Float )
	  	 Local dx:Float,dy:Float
		 dx = x1 - x2
		 dy = y1 - y2
	     Return Sqrt((dx*dx) + (dy*dy))
	  End	



  '*****************************************************************
  Method internal_RotateSpriteCol:Int(pSprite:ftObject)
  '*****************************************************************
    Local cx:Float
	Local cy:Float
    Local SinVal:Float
Local CosVal:Float
Local xSinVal:Float
Local ySinVal:Float
Local xCosVal:Float
Local yCosVal:Float
Local ang:Float

	Self.hOffX = (0.5-Self.handleX)*w*Self.scaleX
	Self.hOffY = (0.5-Self.handleY)*h*Self.scaleY




    'ang = pSprite.angle * 0.017453293
    ang = (pSprite.angle + pSprite.offAngle)* 0.0174533
    SinVal = Sinr(ang)
    CosVal=Cosr(ang)

    'x = -pSprite.width/2
    'y = pSprite.height/2
    cx = -pSprite.w/2.0*pSprite.scaleX * pSprite.collScale 
	'If Self.isFlipV = True Then cx *= -1
	If Self.isFlipV = True Then cy *= -1
    cy =  pSprite.h/2.0*pSprite.scaleY * pSprite.collScale
    
	'If Self.isFlipH = True Then cy *= -1
	If Self.isFlipH = True Then cx *= -1
#rem
    xCosVal = x * CosVal
    yCosVal = y * CosVal
    xSinVal = x * SinVal
    ySinVal = y * SinVal

    pSprite.x1=(xCosVal)-(ySinVal)
    pSprite.y1=(yCosVal)+(xSinVal)

    'x = x * -1
    pSprite.x2=(-xCosVal)-( ySinVal)
    pSprite.y2=( yCosVal)+(-xSinVal)

    'y = y * -1
    pSprite.x3=(-xCosVal)-(-ySinVal)
    pSprite.y3=(-yCosVal)+(-xSinVal)

    'x = x * -1
    pSprite.x4=( xCosVal)-(-ySinVal)
    pSprite.y4=(-yCosVal)+( xSinVal)


    y = pSprite.colHeight
    x = -pSprite.colWidth
#end
    xCosVal = cx * CosVal
    yCosVal = cy * CosVal
    xSinVal = cx * SinVal
    ySinVal = cy * SinVal

    pSprite.x1c=(xCosVal)-(ySinVal)+Self.hOffX
    pSprite.y1c=(yCosVal)+(xSinVal)+Self.hOffY

    'x = x * -1
    pSprite.x2c=(-xCosVal)-( ySinVal)+Self.hOffX
    pSprite.y2c=( yCosVal)+(-xSinVal)+Self.hOffY

    'y = y * -1
    pSprite.x3c=(-xCosVal)-(-ySinVal)+Self.hOffX
    pSprite.y3c=(-yCosVal)+(-xSinVal)+Self.hOffY

    'x = x * -1
    pSprite.x4c=( xCosVal)-(-ySinVal)+Self.hOffX
    pSprite.y4c=(-yCosVal)+( xSinVal)+Self.hOffY
'END IF
	Return 0
  End

	'-----------------------------------------------------------------------------
	Method internal_Vec2DotProduct:Float(v1:tPointS, v2:tPointS)
		Return (v1.x*v2.x + v1.y*v2.y)
	End

End
'#DOCON#


#rem
footer:This fantomEngine framework is released under the MIT license:
[quote]Copyright (c) 2011-2013 Michael Hartlef

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, and to permit persons to whom the software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
[/quote]
#end