#rem
	Title:        fantomEngine
	Description:  A 2D game framework For the Monkey programming language
	
	Author:       Michael Hartlef
	Contact:      michaelhartlef@gmail.com
	
	Repository:   http://code.google.com/p/fantomengine/
	
	License:      MIT
#End

Import fantomEngine

'nav:<blockquote><nav><b>fantomEngine documentation</b> | <a href="index.html">Home</a> | <a href="classes.html">Classes</a> | <a href="3rdpartytools.html">3rd party tools</a> | <a href="examples.html">Examples</a> | <a href="changes.html">Changes</a></nav></blockquote>
#Rem
'header:The module [b]cftEngine[/b] contains the ftEngine class, which is the main part of the fantomEngine. 
#End

'***************************************
'changes:Changed the values of the touch mode constants in version 1.51.
'summery:The class [b]ftEngine[/b] is the heart of the fantomEngine. After you have created one instance of it, you can let it deal with scenes, layers, objects and all the stuff a game needs.
Class ftEngine
'#DOCOFF#
 	Field soundList := New List<ftSound>
 	Field layerList := New List<ftLayer>
 	Field sceneList := New List<ftScene>
 	Field fontList  := New List<ftFont>
 	Field timerList := New List<ftTimer>

 	Field scoreList := New ftHighScoreList
	Field defaultLayer:ftLayer = Null
	Field defaultScene:ftScene = Null
	Field defaultActive:Bool = True
	Field defaultVisible:Bool = True

	Field swiper:ftSwipe = Null
	Field imgMng:ftImageManager = Null
	
	Field red:Float    = 255.0
	Field blue:Float   = 255.0
	Field green:Float  = 255.0
	Field alpha:Float  = 1.0
	Field blendMode:Int = 0
	
	Field screenWidth:Float
	Field screenHeight:Float
	Field canvasWidth:Float
	Field canvasHeight:Float
	
	Field camX:Float = 0.0
	Field camY:Float = 0.0

	
	Field scaleX:Float = 1.0
	Field scaleY:Float = 1.0
	Field autofitX:Int = 0
	Field autofitY:Int = 0
	Field delta:Float = 1.0
	
	Field lastLayerScale:Float= 1.0
	Field lastLayerAngle:Float= 0.0
	
	Field time:Int
	Field _fps:Int=0
	Field _ifps:Int=0
	Field _fpsTime:Int = 0
	
	Field timeScale:Float = 1.0
	Field oldtimeScale:Float = 0.0
	
	Field deltaTime:Int = 0 
	Field lastTime:Int = 0
	Field lastMillisecs:Int = app.Millisecs()
	Field engineTime:Float = 0.0
	
	Field accelX:Float
	Field accelY:Float
	Field accelZ:Float
	'Field objID:Int=0
	
	Field isPaused:Bool = False
	
	Field volumeSFX:Float = 1.0
	Field volumeMUS:Float = 1.0

	Field objhandleX:Float = 0.5
	Field objhandleY:Float = 0.5
	
	Field nextSoundChannel:Int = 99
	Field maxSoundChannel:Int = 32
	Field firstSoundChannel:Int = 0
	
	'Object types
	Const otImage% = 0
	Const otText% = 1
	Const otCircle% = 2
	Const otBox% = 3
	Const otZoneBox% = 4
	Const otZoneCircle% = 5
	Const otTileMap% = 6
	Const otTextMulti% = 7
'**-----------------------------------**

	Const otPoint% = 8
	Const otStickMan% = 9
	Const otOval% = 10
	Const otLine% = 11
	Const otPoly% = 12

'**-----------------------------------**
'#DOCON#
	'Collision types
	Const ctCircle% = 0
	Const ctBox% = 1
	Const ctBound% = 2
	Const ctLine% = 3
	
	'touch modes
	Const tmCircle% = 1
	Const tmBound% = 2
	Const tmBox% = 3
	
	'Canvas center modes
	Const cmZoom% = 0		'Old behaviour, canvas will be stretched/fitted into the screen. 
	Const cmCentered% = 1	'Pixel perfect, canvas will be centered into the screen space. No content scaling.
	Const cmLetterbox% = 2	'Default. Canvas will be scaled to the smaller scale factor of X or Y.
	Const cmPerfect% = 3 	'Pixel perfect (Top left). No content/Canvas scaling.

	'Text align modes Y/X
	Const taTopLeft% = 0
	Const taTopCenter% = 1
	Const taTopRight% = 2

	Const taCenterLeft% = 7
	Const taCenterCenter% = 3
	Const taCenterRight% = 4

	Const taBottomLeft% = 8
	Const taBottomCenter% = 5
	Const taBottomRight% = 6

	'Transition tween modes
	Const twmLinear% = 0
	
	Const twmBounceEaseIn% = 1
	Const twmBounceEaseInOut% = 2
	Const twmBounceEaseOut% = 3
	
	Const twmCircleEaseIn% = 4
	Const twmCircleEaseInOut% = 5
	Const twmCircleEaseOut% = 6
	
	Const twmCubicEaseIn% = 7
	Const twmCubicEaseInOut% = 8
	Const twmCubicEaseOut% = 9
	
	Const twmEaseIn% = 10
	Const twmEaseInOut% = 11
	Const twmEaseOut% = 12
	
	Const twmElasticEaseIn% = 13
	Const twmElasticEaseInOut% = 14
	Const twmElasticEaseOut% = 15
	
	Const twmExpoEaseIn% = 16
	Const twmExpoEaseInOut% = 17
	Const twmExpoEaseOut% = 18
	
	Const twmSineEaseIn% = 19
	Const twmSineEaseInOut% = 20
	Const twmSineEaseOut% = 21
	
	Const twmQuadEaseIn% = 22
	Const twmQuadEaseInOut% = 23
	Const twmQuadEaseOut% = 24
	
	Const twmQuartEaseIn% = 25
	Const twmQuartEaseInOut% = 26
	Const twmQuartEaseOut% = 27
	
	Const twmQuintEaseIn% = 28
	Const twmQuintEaseInOut% = 29
	Const twmQuintEaseOut% = 30
	


	'------------------------------------------
#Rem
'summery:Activates swipe gesture detection.
'To (de)activate the swipe detection, use ActivateSwipe. To detect(update) a swipe, use SwipeUpdate. If a swipe is detected, fantomEngine will call its OnSwipeDone method. 
'Also have a look at the sample script [a ..\examples\SwipeDetection\SwipeDetection.monkey]SwipeDetection.monkey[/a]
#End
	Method ActivateSwipe:Void(onOff:Bool=True)
		swiper.swipeActive = onOff
	End

	'------------------------------------------
#Rem
'summery:Returns the delta time in milliseconds since the last call.
'Calculates the current delta time in milliseconds since the last call of this command. 
'Usually you call this command during the OnUpdate event of your app. If you just need to retrieve the delta time and not recalculate it, use GetDeltaTime. 
#End
	Method CalcDeltaTime:Int()
		deltaTime = Self.GetTime() - lastTime
		lastTime  += deltaTime
		Return deltaTime
	End

	'------------------------------------------
#Rem
'summery:Does a collision check over all layers and active objects which has a collision group assigned to them.
'To check for collisions via the build-in functionality, use CollisionCheck. Without a parameter, it will check all active objects for collisions. 
' Typically you do this inside mojos' OnUpdate method. If a collision appears, it will call the ftEngine.onObjectCollision method with the two objects as parameters.
' Objects that will be part of a collision need to have a collision group with [ftObject.SetColGroup SetColGroup] assigned to them. 
'The objects that then will need to be checked have to be told with which collision group the can collide. You do that with [ftObject.SetColWith SetColWith]. 
#End
	Method CollisionCheck:Void()
		For Local layer := Eachin layerList
			If layer.isActive Then layer.CollisionCheck()
		Next
	End

	'------------------------------------------
#Rem
'summery:Does a collision check of the given layer and it's active objects which has a collision group assigned to them. 
#End
	Method CollisionCheck:Void(layer:ftLayer)
		If layer.isActive Then layer.CollisionCheck()
	End

	'------------------------------------------
#Rem
'summery:Does a collision check of the given active object.
#End
	Method CollisionCheck:Void(obj:ftObject)
		If obj.layer.isActive Then obj.layer.CollisionCheck(obj)
	End

	'-----------------------------------------------------------------------------
'summery:Cancels all timers attached of the engine.
	Method CancelTimerAll:Void()
		For Local timer := Eachin timerList 
			timer.RemoveTimer()
		Next
	End
	'------------------------------------------
#Rem
'summery:Copies an existing object. 
This command copies a given object and returns the copy. The new object contains all properties of the source object, but not the following:
[list][*]user data object
[*]box2D object 
[*]timer
[*]transitions
[*]tileMap object list[/list]
#End
	Method CopyObject:ftObject(srcObj:ftObject)
		Local newObj:ftObject
		
		newObj = New ftObject


		newObj.xPos = srcObj.xPos
		newObj.yPos = srcObj.yPos
		newObj.zPos = srcObj.zPos
		newObj.w = srcObj.w
		newObj.h = srcObj.h
		
		newObj.x2 = srcObj.x2		
		newObj.y2 = srcObj.y2
		newObj.verts = srcObj.verts
		
		newObj.rw = srcObj.rw
		newObj.rh = srcObj.rh
		newObj.rox = srcObj.rox
		newObj.roy = srcObj.roy
	
		newObj.angle = srcObj.angle
		newObj.scaleX = srcObj.scaleX
		newObj.scaleY = srcObj.scaleY
		newObj.radius = srcObj.radius
		newObj.friction = srcObj.friction
	
		newObj.speed = srcObj.speed
		newObj.speedX = srcObj.speedX
		newObj.speedY = srcObj.speedY
		newObj.speedSpin = srcObj.speedSpin
		newObj.speedAngle = srcObj.speedAngle
		newObj.speedMax = srcObj.speedMax
		newObj.speedMin = srcObj.speedMin
	
		newObj.engine = srcObj.engine
	
		newObj.red = srcObj.red
		newObj.blue = srcObj.blue
		newObj.green = srcObj.green
		newObj.alpha = srcObj.alpha
		newObj.blendMode = srcObj.blendMode
	
		newObj.objImg = srcObj.objImg
	
		newObj.animTime = srcObj.animTime
		newObj.frameCount = srcObj.frameCount
		newObj.frameStart = srcObj.frameStart
		newObj.frameEnd = srcObj.frameEnd
		newObj.frameTime = srcObj.frameTime
		newObj.frameLength = srcObj.frameLength
	
		'newObj.layer:ftLayer = Null
		'newObj.layerNode:list.Node<ftObject> = Null     'Version 1.21
		If srcObj.layer <> Null Then
			newObj.SetLayer(srcObj.layer)
		Endif

		'newObj.parentObj:ftObject = Null
		'newObj.parentNode:list.Node<ftObject> = Null     'Version 1.21
		If srcObj.parentObj <> Null Then
			newObj.SetParent(srcObj.parentObj)
		Endif
	
		'newObj.timerList := New List<ftTimer>
		'newObj.childObjList := New List<ftObject>
		'newObj.transitionList := New List<ftTrans>
	
		newObj.objFont = srcObj.objFont
	
		newObj.id = srcObj.id
		newObj.textMode = srcObj.textMode
		newObj.name = srcObj.name
		newObj.text = srcObj.text
		newObj.tag = srcObj.tag
		newObj.type = srcObj.type
		newObj.groupID = srcObj.groupID
	
		newObj.collType = srcObj.collType
		newObj.collGroup = srcObj.collGroup
		newObj.collWith = srcObj.collWith
		newObj.colCheck = srcObj.colCheck
		newObj.collScale = srcObj.collScale
	
		newObj.isVisible = srcObj.isVisible
		newObj.isAnimated = srcObj.isAnimated
		newObj.isActive = srcObj.isActive
		newObj.isWrappingX = srcObj.isWrappingX
		newObj.isWrappingY = srcObj.isWrappingY
		newObj.touchMode = srcObj.touchMode
		newObj.isFlipH = srcObj.isFlipH
		newObj.isFlipV = srcObj.isFlipV

		newObj.onDeleteEvent = srcObj.onDeleteEvent
		newObj.onRenderEvent = srcObj.onRenderEvent
		newObj.onUpdateEvent = srcObj.onUpdateEvent
	
		newObj.x1c = srcObj.x1c
		newObj.y1c = srcObj.y1c
		newObj.x2c = srcObj.x2c
		newObj.y2c = srcObj.y2c
		newObj.x3c = srcObj.x3c
		newObj.y3c = srcObj.y3c
		newObj.x4c = srcObj.x4c
		newObj.y4c = srcObj.y4c

		newObj.deleted = srcObj.deleted
	
		newObj.tileMap = srcObj.tileMap
		
		newObj.tileCount = srcObj.tileCount
		newObj.tileCountX = srcObj.tileCountX
		newObj.tileCountY = srcObj.tileCountY
		newObj.tileSizeX = srcObj.tileSizeX
		newObj.tileSizeY = srcObj.tileSizeY
		newObj.tileModSX = srcObj.tileModSX
		newObj.tileModSY = srcObj.tileModSY
		'newObj.mapObjList = srcObj.mapObjList
	
		'newObj.dataObj:Object = Null
		'newObj.box2DBody:Object = Null


		newObj.internal_RotateSpriteCol(newObj)

		newObj.objPathUpdAngle = srcObj.objPathUpdAngle
		newObj.offAngle = srcObj.offAngle
		newObj.handleX = srcObj.handleX
		newObj.handleY = srcObj.handleY
		newObj.hOffX = srcObj.hOffX
		newObj.hOffY = srcObj.hOffY


		Return ftObject(newObj)
	End

#Rem
	Method CopyObject_old:ftObject(srcObj:ftObject)
		Local newObj:Object
		Local cInfo:ClassInfo
		Local newObjD:Object
		Local cInfoD:ClassInfo

		cInfo = GetClass(srcObj)
		newObj = cInfo.NewInstance()			
		For Local tmpField := Eachin cInfo.GetFields(True)
			Local fieldobj:Object = tmpField.GetValue(srcObj)
			Select tmpField.Type.Name
				Case "monkey.boxes.BoolObject"
					tmpField.SetValue(newObj, fieldobj)
				Case "monkey.boxes.IntObject"
					tmpField.SetValue(newObj, fieldobj)
				Case "monkey.boxes.StringObject"
					tmpField.SetValue(newObj, fieldobj)
				Case "monkey.boxes.FloatObject"
					tmpField.SetValue(newObj, fieldobj)
			End Select
		Next
		
		ftObject(newObj).engine = Self
		'Set layer
		ftObject(newObj).SetLayer(srcObj.layer)
		'set parent object
		If srcObj.parentObj <> Null Then
			ftObject(newObj).SetParent(srcObj.parentObj)
		Endif
		'Set image
		ftObject(newObj).img = srcObj.img
		'Set font
		ftObject(newObj).objFont = srcObj.objFont
		'Set tilemap
		ftObject(newObj).tileMap = srcObj.tileMap
		'Set colwidth
		ftObject(newObj).collWith = srcObj.collWith
		
		Return ftObject(newObj)
	End
#End
	'-----------------------------------------------------------------------------
'changes:New in v1.52
#Rem
'summery:Creates an animated image object (sprite) from the given sprite atlas with a center at xPos/yPos. 
The texture will be grabbed from frameStartX/frameStartY with the given frameWidth/frameHeight. The number of frames will be taken from the given frameCount.
#End
	Method CreateAnimImage:ftObject(atl:ftImage, frameStartX:Int, frameStartY:Int, frameWidth:Int, frameHeight:Int, frameCount:Int, xpos:Float, ypos:Float, _ucob:Object=Null)
		Local obj:ftObject
		If _ucob = Null Then
			obj = New ftObject
		Else
			obj = ftObject(_ucob)
		endif
		obj.engine = Self
		obj.xPos = xpos
		obj.yPos = ypos
		obj.type = otImage
		obj.isAnimated = True

		obj.objImg = imgMng.GrabImage(atl,frameStartX,frameStartY,frameWidth,frameHeight,frameCount,Image.MidHandle )
		obj.SetAnimated(True)
		obj.frameCount = obj.objImg.img.Frames()
		obj.frameStart = 1
		obj.frameEnd = obj.frameCount
		obj.frameLength = obj.frameEnd - obj.frameStart + 1
		'obj.radius = (Max(obj.objImg.img.Height(), obj.objImg.img.Width())*1.42)/2
		obj.radius = (Max(obj.objImg.img.Height(), obj.objImg.img.Width()))/2.0
		obj.w = obj.objImg.img.Width()
		obj.h = obj.objImg.img.Height()
		
		obj.rw = obj.w
		obj.rh = obj.h
		
		obj.SetLayer(Self.defaultLayer)
		obj.SetActive(Self.defaultActive)
		obj.SetVisible(Self.defaultVisible)
		
		obj.collType = ctCircle
		obj.internal_RotateSpriteCol(obj)
		Return obj
	End

	'-----------------------------------------------------------------------------
'changes:Changed in v1.52. The caluclation of the radius will be down from the max of height and width. And not from its corners anymore.
#Rem
'summery:Creates an animated image object (sprite) from the given sprite atlas with a center at xPos/yPos. 
The texture will be grabbed from frameStartX/frameStartY with the given frameWidth/frameHeight. The number of frames will be taken from the given frameCount.
#End
	Method CreateAnimImage:ftObject(atl:Image, frameStartX:Int, frameStartY:Int, frameWidth:Int, frameHeight:Int, frameCount:Int, xpos:Float, ypos:Float, _ucob:Object=Null)
		Local obj:ftObject
		If _ucob = Null Then
			obj = New ftObject
		Else
			obj = ftObject(_ucob)
		endif
		obj.engine = Self
		obj.xPos = xpos
		obj.yPos = ypos
		obj.type = otImage
		obj.isAnimated = True

		obj.objImg = imgMng.GrabImage( atl, frameStartX,frameStartY,frameWidth,frameHeight,frameCount,Image.MidHandle )
		obj.SetAnimated(True)
		obj.frameCount = obj.objImg.img.Frames()
		obj.frameStart = 1
		obj.frameEnd = obj.frameCount
		obj.frameLength = obj.frameEnd - obj.frameStart + 1
		'obj.radius = (Max(obj.objImg.img.Height(), obj.objImg.img.Width())*1.42)/2
		obj.radius = (Max(obj.objImg.img.Height(), obj.objImg.img.Width()))/2.0
		obj.w = obj.objImg.img.Width()
		obj.h = obj.objImg.img.Height()
		
		obj.rw = obj.w
		obj.rh = obj.h
		
		obj.SetLayer(Self.defaultLayer)
		obj.SetActive(Self.defaultActive)
		obj.SetVisible(Self.defaultVisible)
		
		obj.collType = ctCircle
		obj.internal_RotateSpriteCol(obj)
		Return obj
	End

	'------------------------------------------
'changes:Changed in v1.52. The caluclation of the radius will be down from the max of height and width. And not from its corners anymore.
#Rem
'summery:Creates a rectangle with the given width/height and the center at xpos/ypos.
#End
	Method CreateBox:ftObject(width:Float, height:Float, xpos:Float, ypos:Float, _ucob:Object=Null)
		Local obj:ftObject
		If _ucob = Null Then
			obj = New ftObject
		Else
			obj = ftObject(_ucob)
		endif
		obj.engine = Self
		obj.xPos = xpos
		obj.yPos = ypos
		obj.type = otBox
		'obj.radius = (Max(width,height)*1.42)/2.0
		obj.radius = (Max(width,height))/2.0
		obj.w = width
		obj.h = height
		
		obj.rw = obj.w
		obj.rh = obj.h
		
		obj.SetLayer(Self.defaultLayer)
		obj.SetActive(Self.defaultActive)
		obj.SetVisible(Self.defaultVisible)
		obj.collType = ctBound
		obj.internal_RotateSpriteCol(obj)
		Return obj
	End

	'------------------------------------------
#Rem
'summery:Creates a circle with the given radius and the center at xpos/ypos. 
#End
	Method CreateCircle:ftObject(radius:Float, xpos:Float, ypos:Float, _ucob:Object=Null)
		Local obj:ftObject
		If _ucob = Null Then
			obj = New ftObject
		Else
			obj = ftObject(_ucob)
		endif
		obj.engine = Self
		obj.xPos = xpos
		obj.yPos = ypos
		obj.type = otCircle

		obj.radius = radius
		obj.w = obj.radius*2
		obj.h = obj.radius*2
		
		obj.rw = obj.w
		obj.rh = obj.h
		
		obj.SetLayer(Self.defaultLayer)
		obj.SetActive(Self.defaultActive)
		obj.SetVisible(Self.defaultVisible)
		obj.collType = ctCircle
		obj.internal_RotateSpriteCol(obj)
		Return obj
	End

	'------------------------------------------
'changes:Changed in v1.52. The caluclation of the radius will be down from the max of height and width. And not from its corners anymore.
#Rem
'summery:Creates an image object (sprite) from the given filename with a center at xpos/ypos. 
'To load an animated image object, use CreateAnimImage. 
#End
	Method CreateImage:ftObject(filename:String, xpos:Float, ypos:Float, _ucob:Object=Null)
		Local obj:ftObject
		If _ucob = Null Then
			obj = New ftObject
		Else
			obj = ftObject(_ucob)
		endif
		obj.engine = Self
		obj.xPos = xpos
		obj.yPos = ypos
		obj.type = otImage
		obj.objImg = Self.imgMng.LoadImage(filename, 1, Image.MidHandle)
		If obj.objImg = Null Then Error("Image "+filename+" not found!")

		'obj.radius = (Max(obj.objImg.img.Height(), obj.objImg.img.Width())*1.42)/2.0
		obj.radius = (Max(obj.objImg.img.Height(), obj.objImg.img.Width()))/2.0
		obj.w = obj.objImg.img.Width()
		obj.h = obj.objImg.img.Height()
		
		obj.rw = obj.w
		obj.rh = obj.h
		
		obj.SetLayer(Self.defaultLayer)
		obj.SetActive(Self.defaultActive)
		obj.SetVisible(Self.defaultVisible)
		obj.collType = ctCircle
		obj.internal_RotateSpriteCol(obj)
		Return obj
	End

	'------------------------------------------
'changes:Changed in v1.52. The caluclation of the radius will be down from the max of height and width. And not from its corners anymore.
#Rem
'summery:Creates an image object (sprite) from the given image with a center at xpos/ypos. 
#End
	Method CreateImage:ftObject(image:Image, xpos:Float, ypos:Float, _ucob:Object=Null)
		Local obj:ftObject
		If _ucob = Null Then
			obj = New ftObject
		Else
			obj = ftObject(_ucob)
		endif
		obj.engine = Self
		obj.xPos = xpos
		obj.yPos = ypos
		obj.type = otImage
		obj.objImg = imgMng.LoadImage(image)

		'obj.radius = (Max(obj.objImg.img.Height(), obj.objImg.img.Width())*1.42)/2.0
		obj.radius = (Max(obj.objImg.img.Height(), obj.objImg.img.Width()))/2.0
		obj.w = obj.objImg.img.Width()
		obj.h = obj.objImg.img.Height()
		
		obj.rw = obj.w
		obj.rh = obj.h
		
		obj.SetLayer(Self.defaultLayer)
		obj.SetActive(Self.defaultActive)
		obj.SetVisible(Self.defaultVisible)
		obj.collType = ctCircle
		obj.internal_RotateSpriteCol(obj)
		Return obj
	End

	'-----------------------------------------------------------------------------
'changes:Changed in v1.52. The caluclation of the radius will be down from the max of height and width. And not from its corners anymore.
#Rem
'summery:Creates an image object (sprite) from the given sprite atlas with a center at xPos/yPos. The texture will be grabbed from x/y with the given width/height.
#End
	Method CreateImage:ftObject(atlas:Image, x:Int, y:Int, width:Int, height:Int, xpos:Float, ypos:Float, _ucob:Object=Null)
		Local obj:ftObject
		If _ucob = Null Then
			obj = New ftObject
		Else
			obj = ftObject(_ucob)
		endif
		obj.engine = Self
		obj.xPos = xpos
		obj.yPos = ypos
		obj.type = otImage
		obj.objImg = imgMng.GrabImage(atlas, x,y,width,height,1,Image.MidHandle )
	
		'obj.radius = (Max(obj.objImg.img.Height(), obj.objImg.img.Width())*1.42)/2.0
		obj.radius = (Max(obj.objImg.img.Height(), obj.objImg.img.Width()))/2.0
		obj.w = obj.objImg.img.Width()
		obj.h = obj.objImg.img.Height()
		
		obj.rw = obj.w
		obj.rh = obj.h
		
		obj.SetLayer(Self.defaultLayer)
		obj.SetActive(Self.defaultActive)
		obj.SetVisible(Self.defaultVisible)
		obj.collType = ctCircle
		obj.internal_RotateSpriteCol(obj)
		Return obj
	End

	'-----------------------------------------------------------------------------
'changes:Changed in version 1.52 to support the sparrow file format
#Rem
'summery:Loads a subimage from a packed texture created by the tool TexturePacker with a center at xpos/ypos. 
It supports rotated sub images in LibGDX files too.
From version 1.52 on it supports Sparrow compatible files (.xml).
#End
	' The next CreateImage version uses image atlas created by the tool TexturePacker, a data file
	' exported from TexturePacker in LibGDX format and the name of the sub image stored inside the texture atlas
	Method CreateImage:ftObject(atlas:Image, dataFileName:String, subImageName:String, xpos:Float, ypos:Float, _ucob:Object=Null)
		Local obj:ftObject
		If _ucob = Null Then
			obj = New ftObject
		Else
			obj = ftObject(_ucob)
		endif
'Code provided by fantomEngine user TriGaDe, modified by Michael Hartlef >>>>>>>>>>>
		'** TexturePacker variables
		Local tpStringFromFile:String = LoadString(dataFileName)
		Local tpAllStrings:String[] = tpStringFromFile.Split(String.FromChar(10))
		Local tpXPos:Int
		Local tpYPos:Int
		Local tpWidth:Int
		Local tpHeight:Int	
		Local aslen:Int
		If dataFileName.ToLower().Find(".txt") > 0 Then
			aslen = tpAllStrings.Length()
		    For Local count:Int = 0 To aslen-1
				If( String(tpAllStrings[count]).ToLower() = subImageName.ToLower()) Then
					'** Get rotation flag
					Local strRot:String = tpAllStrings[count+1]
					strRot = strRot.Replace("rotate:","").Trim()
					If strRot.ToLower = "true" Then obj.offAngle = -90
					'** Get X, Y
					Local strXY:String = tpAllStrings[count+2]
					strXY = strXY.Replace("xy:","").Trim()
					Local strXYsplit:String[] = strXY.Split(",")
					tpXPos = Int(strXYsplit[0])
					tpYPos = Int(strXYsplit[1])
					
					'** Get Width, Height
					Local strWH:String = tpAllStrings[count+3]
					strWH = strWH.Replace("size:","").Trim()
					Local strWHsplit:String[] = strWH.Split(",")
					tpWidth = Int(strWHsplit[0])
					tpHeight = Int(strWHsplit[1])
				Endif
			Next
		Else
			aslen = tpAllStrings.Length()
		    For Local count:Int = 0 To aslen-1
		    	Local s:String = String(tpAllStrings[count]).ToLower().Trim()
		    	
				If s.Contains(String.FromChars([34])+subImageName.ToLower()+String.FromChars([34])) Then
		    	Print (s)
    '<SubTexture name="background2" x="2" y="2" width="320" height="480"/>
    				s = s.Replace(String.FromChars([34]),"")
		    	Print (s)
    '<SubTexture name=background2 x=2 y=2 width=320 height=480/>
    				s = s.Replace("<subtexture ","")
		    	Print (s)
    				s = s.Replace("/>","")
		    	Print (s)
    'name=background2 x=2 y=2 width=320 height=480
					Local strSplit:String[] = s.Split(" ")

	'name=background2
	'x=2
	'y=2
	'width=320
	'height=480

					'** Get X
					Local strX:String = strSplit[1]
					Local strXsplit:String[] = strX.Split("=")
					tpXPos = Int(strXsplit[1])
					'** Get Y
					Local strY:String = strSplit[2]
					Local strYsplit:String[] = strY.Split("=")
					tpYPos = Int(strYsplit[1])
					'** Get Width
					Local strW:String = strSplit[3]
					Local strWsplit:String[] = strW.Split("=")
					tpWidth = Int(strWsplit[1])
					'** Get Height
					Local strH:String = strSplit[4]
					Local strHsplit:String[] = strH.Split("=")
					tpHeight = Int(strHsplit[1])
					
				Endif
			Next
		Endif
'<<<<<<<<< Code provided by fantomEngine user TriGaDe, modified by Michael Hartlef
	    
		'Local obj:ftObject = New ftObject
		obj.engine = Self
		obj.xPos = xpos
		obj.yPos = ypos
		obj.type = otImage
		obj.objImg = imgMng.GrabImage(atlas, tpXPos,tpYPos,tpWidth,tpHeight,1,Image.MidHandle )
	
		'obj.radius = (Max(obj.objImg.img.Height(), obj.objImg.img.Width())*1.42)/2.0
		obj.radius = (Max(obj.objImg.img.Height(), obj.objImg.img.Width()))/2.0
		If obj.offAngle < 0 Then
			obj.h = obj.objImg.img.Width()
			obj.w = obj.objImg.img.Height()
		Else
			obj.w = obj.objImg.img.Width()
			obj.h = obj.objImg.img.Height()
		Endif
		obj.rw = obj.objImg.img.Width()
		obj.rh = obj.objImg.img.Height()
		
		obj.SetLayer(Self.defaultLayer)
		obj.SetActive(Self.defaultActive)
		obj.SetVisible(Self.defaultVisible)
		obj.collType = ctCircle
		obj.internal_RotateSpriteCol(obj)
		Return obj
	End

	'------------------------------------------
'changes:Changed in version 1.52 so you can use custom layers now.
#Rem
'summery:Creates a new layer. 
'To create a new layer, use CreateLayer. To delete a layer, use RemoveLayer. A new layer is automatically added to the defaultScene scene.
#End
	Method CreateLayer:ftLayer(_ucla:Object=Null)
		Local layer:ftLayer
		If _ucla = Null Then
			layer = New ftLayer
		Else
			layer = ftLayer(_ucla)
		Endif
		
		'Local layer:ftLayer = New ftLayer
		layer.engine = Self
		layer.engineNode = layerList.AddLast(layer)
		'layerList.AddLast(layer)
		Self.defaultScene.AddLayer(layer)
		Return layer
	End

	'------------------------------------------
'changes:New in version 1.51, provided by Douglas Williams
#Rem
'summery:Creates a line object starting at xpos/ypos and ending at x/y. 
The objects handle is in the middle of the line by default and can be changed via a call to ftObject.SetHandle.
#End
	Method CreateLine:ftObject(xpos:Float, ypos:Float, x2:Float, y2:Float, _ucob:Object=Null)
		Local obj:ftObject
		If _ucob = Null Then
			obj = New ftObject
		Else
			obj = ftObject(_ucob)
		endif
		obj.engine = Self
		obj.xPos = xpos		
		obj.yPos = ypos
		obj.x2 = x2
		obj.y2 = y2
		obj.type = otLine
		
		obj.w = obj.GetVectorDist(x2,y2)
		obj.h = 1


		obj.xPos = (x2-xpos)/2.0+xpos
		obj.yPos = (y2-ypos)/2.0+ypos


		obj.radius = obj.w / 2.0
		obj.rw = obj.w
		obj.rh = obj.h
		
		obj.SetLayer(Self.defaultLayer)
		obj.SetActive(Self.defaultActive)
		obj.SetVisible(Self.defaultVisible)
		obj.collType = ctBound
		obj.internal_RotateSpriteCol(obj)
		obj.SetAngle(obj.GetVectorAngle(x2,y2))
		'Print("angle="+obj.GetVectorAngle(x2,y2))
		Return obj
	End
	'------------------------------------------
#Rem
'summery:Creates a new object timer. 
When the timer fires it will call OnObjectTimer. A repeatCount of -1 will let the timer run forever.
#End
	Method CreateObjTimer:ftTimer(obj:ftObject, timerID:Int, duration:Int, repeatCount:Int = 0 )
		Local retTimer:ftTimer
		retTimer = obj.CreateTimer(timerID, duration, repeatCount)
		Return retTimer
	End

	'------------------------------------------
'changes:New in version 1.51, provided by Douglas Williams
'summery:Creates an oval object with the given width/height and the center at xpos/ypos. 
	Method CreateOval:ftObject(width:Float, height:Float, xpos:Float, ypos:Float, _ucob:Object=Null)
		Local obj:ftObject
		If _ucob = Null Then
			obj = New ftObject
		Else
			obj = ftObject(_ucob)
		Endif
		obj.engine = Self
		obj.xPos = xpos
		obj.yPos = ypos
		obj.type = otOval

		obj.w = width
		obj.h = height
		
		obj.radius = Max(obj.w, obj.h) / 2.0
		
		obj.rw = obj.w
		obj.rh = obj.h
		
		obj.SetLayer(Self.defaultLayer)
		obj.SetActive(Self.defaultActive)
		obj.SetVisible(Self.defaultVisible)
		obj.collType = ctCircle
		obj.internal_RotateSpriteCol(obj)
		Return obj
	End
	'------------------------------------------
#Rem
'summery:Creates a path with its center at the given xpos/ypos coordinates.
#End
	Method CreatePath:ftPath(xpos:Float, ypos:Float )
		Local newPath:ftPath = New ftPath
		newPath.engine = Self
		newPath.xPos = xpos
		newPath.yPos = ypos
		Return newPath
	End

	'------------------------------------------
'changes:New in version 1.51, provided by Douglas Williams
'summery:Creates a point object at the given xpos/ypos.
	Method CreatePoint:ftObject(xpos:Float, ypos:Float, _ucob:Object=Null)
		Local obj:ftObject
		If _ucob = Null Then
			obj = New ftObject
		Else
			obj = ftObject(_ucob)
		endif
		obj.engine = Self
		obj.xPos = xpos
		obj.yPos = ypos
		obj.type = otPoint

		obj.w = 1
		obj.h = 1
				
		obj.radius = 0.5		
		obj.rw = obj.w
		obj.rh = obj.h
		
		obj.SetLayer(Self.defaultLayer)
		obj.SetActive(Self.defaultActive)
		obj.SetVisible(Self.defaultVisible)
		obj.collType = ctCircle
		obj.internal_RotateSpriteCol(obj)
		Return obj
	End
	'------------------------------------------
'changes:New in version 1.51, provided by Douglas Williams
'summery:Creates a polygon object with supplied vertices pairs (Minimum of 3 pairs required).
	Method CreatePoly:ftObject(verts:Float[], xpos:Float, ypos:Float, _ucob:Object=Null)
		Local minX:Float = 99999,maxX:Float=-99999, minY:Float=99999, maxY:Float=-99999
		Local vertsLen:Int
		Local obj:ftObject
		If _ucob = Null Then
			obj = New ftObject
		Else
			obj = ftObject(_ucob)
		endif
		obj.engine = Self
		obj.xPos = xpos
		obj.yPos = ypos
		'obj.verts = verts
		vertsLen = verts.Length()
		obj.verts = New Float[vertsLen]
		For Local i:Int = 0 To (vertsLen-1) Step 2
			' x coord
			obj.verts[i] = verts[i]
			If verts[i] < minX Then minX = verts[i]
			If verts[i] > maxX Then maxX = verts[i]

			' y coord
			obj.verts[i+1] = verts[i+1]
			If verts[i+1] < minY Then minY = verts[i+1]
			If verts[i+1] > maxY Then maxY = verts[i+1]
		Next
		obj.type = otPoly
			
		'obj.w = canvasWidth
		obj.w = Abs(maxX - minX)
		'obj.h = canvasHeight
		obj.h = Abs(maxY - minY)
		
		obj.rw = obj.w
		obj.rh = obj.h
		
		obj.SetLayer(Self.defaultLayer)
		obj.SetActive(Self.defaultActive)
		obj.SetVisible(Self.defaultVisible)
		obj.collType = ctBound
		obj.internal_RotateSpriteCol(obj)
		Return obj
	End
	'------------------------------------------
'changes:New in version 1.52.
#Rem
'summery:Creates a new scene. 
'To create a new scene, use CreateScene. To delete a scene, use RemoveScene. A new layer is automatically added to the defaultScene scene.
#End
	Method CreateScene:ftScene(_ucSc:Object=Null)
		Local scene:ftScene
		If _ucSc = Null Then
			scene = New ftScene
		Else
			scene = ftScene(_ucSc)
		Endif
		
		scene.engine = Self
		scene.engineNode = sceneList.AddLast(scene)
		Return scene
	End
	'------------------------------------------
'changes:New in version 1.51, provided by Douglas Williams
#Rem
'summery:Creates a stickman with top left corner at position xpos/ypos with size of width:8 / height:29
#End
	Method CreateStickMan:ftObject(xpos:Float, ypos:Float, _ucob:Object=Null)
		Local obj:ftObject
		If _ucob = Null Then
			obj = New ftObject
		Else
			obj = ftObject(_ucob)
		endif
		obj.engine = Self
		obj.xPos = xpos
		obj.yPos = ypos
		obj.type = otStickMan
		
		obj.w = 8
		obj.h = 29
		obj.radius = 14.5
		
		obj.rw = obj.w
		obj.rh = obj.h
		
		obj.SetHandle(0.0, 0.0)			'Upper Left
		
		obj.SetLayer(Self.defaultLayer)
		obj.SetActive(Self.defaultActive)
		obj.SetVisible(Self.defaultVisible)
		obj.collType = ctBound
		obj.internal_RotateSpriteCol(obj)
		Return obj
	End
	'------------------------------------------
#Rem
'summery:Creates a new text object. 
#End
	Method CreateText:ftObject(font:ftFont, txt:String, xpos:Float, ypos:Float, textmode:Int=ftEngine.taTopLeft)
		Local obj:ftObject = New ftObject
		obj.objFont = font
		obj.engine = Self
#rem	
		Select mode
			Case 0
				obj.xPos = xp
			Case 1
				obj.xPos = xp - font.Length(t)/2.0
			Case 2
				obj.xPos = xp - font.Length(t)
		End
#end
		obj.textMode = textmode
		obj.xPos = xpos
		obj.yPos = ypos
		obj.type = otText
#rem
		obj.h = obj.objFont.lineHeight
		obj.rh = obj.h
		obj.text = t
		obj.w = obj.objFont.Length(t)
		obj.rw = obj.w
		obj.radius = Max(obj.h, obj.w)/2.0
#End
		obj.SetText(txt)
		
		obj.SetLayer(Self.defaultLayer)
		obj.SetActive(Self.defaultActive)
		obj.SetVisible(Self.defaultVisible)
		obj.collType = ctBound
		obj.internal_RotateSpriteCol(obj)
		Return obj
	End

	'-----------------------------------------------------------------------------
'changes:New in v1.52. 
#Rem
'summery:Create a tile map which you can fill yourself.
#End
	Method CreateTileMap:ftObject(atl:ftImage, tileSizeX:Int, tileSizeY:Int, tileCountX:Int, tileCountY:Int, xpos:Float, ypos:Float )
		Local obj:ftObject = New ftObject
		Local mapTile:ftMapTile
		obj.engine = Self
		obj.xPos = xpos
		obj.yPos = ypos
		obj.type = otTileMap

		obj.tileCountX = tileCountX
		obj.tileCountY = tileCountY
		obj.tileSizeX = tileSizeX
		obj.tileSizeY = tileSizeY

		obj.tileCount = obj.tileCountX * obj.tileCountY
		obj.frameCount = Int(atl.img.Width()/tileSizeX) * Int(atl.img.Height()/tileSizeY)
'Print("obj.tileSizeX="+obj.tileSizeX)
'Print("obj.tileSizeY="+obj.tileSizeY)
'Print("obj.tileCount="+obj.tileCount)
'Print("obj.frameCount="+obj.frameCount)
		
		obj.tileMap = New ftMapTile[obj.tileCount]
		For Local c:Int = 0 To (obj.tileCount-1)
			obj.tileMap[c] = New ftMapTile
		Next
		
		For Local y:Int = 0 To (obj.tileCountY-1)
			For Local x:Int = 0 To (obj.tileCountX-1)
				mapTile = obj.tileMap[y*obj.tileCountX+x]
				mapTile.tileID = -1
				mapTile.column = x
				mapTile.row = y
				mapTile.sizeX = obj.tileSizeX
				mapTile.sizeY = obj.tileSizeY
				mapTile.xOff = obj.tileSizeX * x
				mapTile.yOff = obj.tileSizeY * y
			Next
		Next
		'obj.img = atl.GrabImage( 0,0,obj.tileSizeX,obj.tileSizeY,obj.tileCount,Image.MidHandle )
		obj.objImg = imgMng.GrabImage( atl, 0,0,obj.tileSizeX,obj.tileSizeY,obj.frameCount,Image.MidHandle )
		obj.frameCount = obj.objImg.img.Frames()
		obj.frameStart = 1
		obj.frameEnd = obj.frameCount
		obj.frameLength = obj.frameEnd - obj.frameStart + 1
		'obj.radius = (Max(obj.objImg.img.Height(), obj.objImg.img.Width())*1.42)/2
		obj.radius = (Max(obj.objImg.img.Height(), obj.objImg.img.Width()))/2.0
		obj.w = obj.objImg.img.Width()
		obj.h = obj.objImg.img.Height()
		
		obj.rw = obj.w
		obj.rh = obj.h
		
		obj.SetLayer(Self.defaultLayer)
		obj.SetActive(Self.defaultActive)
		obj.SetVisible(Self.defaultVisible)
		
		obj.collType = -1
		obj.internal_RotateSpriteCol(obj)
		
		Return obj
	End

	'-----------------------------------------------------------------------------
'changes:Changed in v1.52. The caluclation of the radius will be down from the max of height and width. And not from its corners anymore.
#Rem
'summery:Create a tile map which you can fill yourself.
#End
	Method CreateTileMap:ftObject(atl:Image, tileSizeX:Int, tileSizeY:Int, tileCountX:Int, tileCountY:Int, xpos:Float, ypos:Float )
		Local obj:ftObject = New ftObject
		Local mapTile:ftMapTile
		obj.engine = Self
		obj.xPos = xpos
		obj.yPos = ypos
		obj.type = otTileMap

		obj.tileCountX = tileCountX
		obj.tileCountY = tileCountY
		obj.tileSizeX = tileSizeX
		obj.tileSizeY = tileSizeY

		obj.tileCount = obj.tileCountX * obj.tileCountY
		obj.frameCount = Int(atl.Width()/tileSizeX) * Int(atl.Height()/tileSizeY)
'Print("obj.tileSizeX="+obj.tileSizeX)
'Print("obj.tileSizeY="+obj.tileSizeY)
'Print("obj.tileCount="+obj.tileCount)
'Print("obj.frameCount="+obj.frameCount)
		
		obj.tileMap = New ftMapTile[obj.tileCount]
		For Local c:Int = 0 To (obj.tileCount-1)
			obj.tileMap[c] = New ftMapTile
		Next
		
		For Local y:Int = 0 To (obj.tileCountY-1)
			For Local x:Int = 0 To (obj.tileCountX-1)
				mapTile = obj.tileMap[y*obj.tileCountX+x]
				mapTile.tileID = -1
				mapTile.column = x
				mapTile.row = y
				mapTile.sizeX = obj.tileSizeX
				mapTile.sizeY = obj.tileSizeY
				mapTile.xOff = obj.tileSizeX * x
				mapTile.yOff = obj.tileSizeY * y
			Next
		Next
		'obj.img = atl.GrabImage( 0,0,obj.tileSizeX,obj.tileSizeY,obj.tileCount,Image.MidHandle )
		obj.objImg = imgMng.GrabImage( atl,0,0,obj.tileSizeX,obj.tileSizeY,obj.frameCount,Image.MidHandle )
		obj.frameCount = obj.objImg.img.Frames()
		obj.frameStart = 1
		obj.frameEnd = obj.frameCount
		obj.frameLength = obj.frameEnd - obj.frameStart + 1
		'obj.radius = (Max(obj.objImg.img.Height(), obj.objImg.img.Width())*1.42)/2
		obj.radius = (Max(obj.objImg.img.Height(), obj.objImg.img.Width()))/2.0
		obj.w = obj.objImg.img.Width()
		obj.h = obj.objImg.img.Height()
		
		obj.rw = obj.w
		obj.rh = obj.h
		
		obj.SetLayer(Self.defaultLayer)
		obj.SetActive(Self.defaultActive)
		obj.SetVisible(Self.defaultVisible)
		
		obj.collType = -1
		obj.internal_RotateSpriteCol(obj)
		
		Return obj
	End

	'-----------------------------------------------------------------------------
'changes:Changed in v1.51. With the index you can determine, which tilelayer you want to read from a map. Index starts with 1.
#Rem
'summery:Create a tile map from a JSON file exported by the tool Tiled.
The layerIndex tells fantomEngine to load the tileLayer at that index. Index starts with 1.
#End
	Method CreateTileMap:ftObject(filename:String, xpos:Float, ypos:Float, layerIndex:Int=1 )
		Local obj:ftObject = New ftObject
		Local imgH:Int
		Local imgW:int
		Local tlH:Int
		Local tlW:Int
		Local path:String =""
		
		Local margin:Int
		Local spacing:Int
		Local plLen:Int

		'Determine the JSON file path for sub folders
		If filename.Find("/") > -1 Then
			Local pl:= filename.Split("/")
			plLen = pl.Length()
			For Local pi:= 0 To (plLen-2)
				path = path + pl[pi]+"/"
			Next
		Endif

		obj.engine = Self
		obj.xPos = xpos
		obj.yPos = ypos
		obj.type = otTileMap
    	Local fileData:String  = LoadString(filename)
	   	Local jsonData:JSONDataItem = JSONData.ReadJSON(fileData)
    	Local jsonObject:JSONObject = JSONObject(jsonData)
    		
'Print("-----------------------------------------------------")		
'Print ("filename     "+filename)
'Print ("height:      "+jsonObject.GetItem("height"))
'Print ("width:       "+jsonObject.GetItem("width"))
'Print ("orientation: "+jsonObject.GetItem("orientation"))
'Print ("version:     "+jsonObject.GetItem("version"))
'Print ("tileheight:  "+jsonObject.GetItem("tileheight"))
'Print ("tilewidth:   "+jsonObject.GetItem("tilewidth"))
'Print("-----------------------------------------------------")		

		obj.tileCountX = JSONInteger(jsonObject.GetItem("width"))
		obj.tileCountY = JSONInteger(jsonObject.GetItem("height"))
		obj.tileSizeX = JSONInteger(jsonObject.GetItem("tilewidth"))
		obj.tileSizeY = JSONInteger(jsonObject.GetItem("tileheight"))

		obj.tileCount = obj.tileCountX * obj.tileCountY
'Print ("tileCount:   "+obj.tileCount)
		
		obj.tileMap = New ftMapTile[obj.tileCount]
		For Local c:Int = 0 To (obj.tileCount-1)
			obj.tileMap[c] = New ftMapTile
		Next
		
    	Local tilesetObjects:JSONArray = JSONArray(jsonObject.GetItem("tilesets"))

    	For Local tileSet:JSONDataItem = Eachin tilesetObjects
        	Local dataTileSet:JSONObject = JSONObject(tileSet)
'Print dataTileSet.ToString()
'Print ("image: "+dataTileSet.GetItem("image"))
'Print ("imageheight:  "+dataTileSet.GetItem("imageheight"))
'Print ("imagewidth:   "+dataTileSet.GetItem("imagewidth"))
'Print ("tileheight:  "+dataTileSet.GetItem("tileheight"))
'Print ("tilewidth:   "+dataTileSet.GetItem("tilewidth"))
			imgW = JSONInteger(dataTileSet.GetItem("imagewidth"))
			imgH = JSONInteger(dataTileSet.GetItem("imageheight"))
			margin = JSONInteger(dataTileSet.GetItem("margin"))
			spacing = JSONInteger(dataTileSet.GetItem("spacing"))
			tlW = JSONInteger(dataTileSet.GetItem("tilewidth"))+spacing
			tlH = JSONInteger(dataTileSet.GetItem("tileheight"))+spacing
        	'obj.img = Self.LoadImage(dataTileSet.GetItem("image"), tlW, tlH, (imgH/tlH)*(imgW/tlW), Image.MidHandle)
        	If mojo.LoadImage(dataTileSet.GetItem("image"))<> Null Then
        		obj.objImg = imgMng.LoadImage(path + dataTileSet.GetItem("image"), tlW, tlH, (imgH/tlH)*(imgW/tlW), Image.MidHandle)
        	Else
        		obj.objImg = imgMng.LoadImage(path + Self._StripDir(dataTileSet.GetItem("image")), tlW, tlH, (imgH/tlH)*(imgW/tlW), Image.MidHandle)
        	Endif
        	If obj.objImg.img = Null Then Error("Error in method ftEngine.CreateTileMap~n~nCan not load tile image: "+dataTileSet.GetItem("image"))
    	End 

    		
'Print("-----------------------------------------------------")		
    	Local layerObjects:JSONArray = JSONArray(jsonObject.GetItem("layers"))
		Local tc:Int = 0
		Local layerCount:Int = 0
    	For Local layer:JSONDataItem = Eachin layerObjects
        	Local layerData:JSONObject = JSONObject(layer)
'Print layerData.ToString()
'Print ("layer name: "+layerData.GetItem("name"))
'Print (layerData.GetItem("data"))
			tc = 0
			If layerData.GetItem("type") = "tilelayer" then
				layerCount += 1
'Print ("layer name: "+layerData.GetItem("name"))
'Print ("layer type: "+layerData.GetItem("type"))
				If layerCount = layerIndex Then
		        	Local mapTiles:JSONArray = JSONArray(layerData.GetItem("data"))
		        	If mapTiles <> Null Then
				    	For Local tile:JSONDataItem = Eachin mapTiles
			    	    	Local tileID:JSONInteger = JSONInteger(tile)
'Print (tileID.ToString())
			        		obj.tileMap[tc].tileID = tileID-1
			        		tc = tc + 1
			    		Next 
		    		Endif
	    		Endif
    		Endif
			If layerData.GetItem("type") = "objectgroup" Then
'Print ("layer name: "+layerData.GetItem("name"))
'Print ("layer type: "+layerData.GetItem("type"))
		        Local layerObjects:JSONArray = JSONArray(layerData.GetItem("objects"))
		        If layerObjects <> Null Then
				    For Local layerObject:JSONDataItem = Eachin layerObjects
				    	Local objectData:JSONObject = JSONObject(layerObject)
			        	Local mapObj := New ftMapObj
			        	mapObj.layerName = layerData.GetItem("name")
			        	For Local itname:= Eachin objectData.Names()
				        	'Print(itname)

							If itname = "name"
	'Print ("object name: "+objectData.GetItem("name"))
								mapObj.name = objectData.GetItem("name")
							Endif
							If itname = "type"
	'Print ("object type: "+objectData.GetItem("type"))
								mapObj.type = objectData.GetItem("type")
							Endif
							If itname = "x"
	'Print ("object x: "+objectData.GetItem("x"))
								mapObj.x = objectData.GetItem("x")
							Endif
							If itname = "y"
	'Print ("object y: "+objectData.GetItem("y"))
								mapObj.y = objectData.GetItem("y")
							Endif
							If itname = "width"
	'Print ("object width: "+objectData.GetItem("width"))
								mapObj.width = objectData.GetItem("width")
							Endif
							If itname = "height"
	'Print ("object height: "+objectData.GetItem("height"))
								mapObj.height = objectData.GetItem("height")
							Endif
							If itname = "opacity"
	'Print ("object opacity: "+objectData.GetItem("opacity"))
								mapObj.alpha = objectData.GetItem("opacity")
							Endif
							If itname = "visible"
	'Print ("object visible: "+objectData.GetItem("visible"))
								mapObj.isVisible = objectData.GetItem("visible")
							Endif
							If itname = "properties"
	'Print ("object properties: "+objectData.GetItem("properties"))
								Local propItems := JSONObject(objectData.GetItem("properties"))
								'mapObj.properties = 
								mapObj.properties = New StringMap<String>
								For Local pname:= Eachin propItems.Names()
	'Print("Property " + pname+"="+propItems.GetItem(pname))
									mapObj.properties.Add(pname,propItems.GetItem(pname))
								Next
								
	'							For Local mxt := Eachin mapObj.properties
	'Print("Property " + mxt.Key()+"="+mxt.Value())
	'							Next
							endif
	
							Local polyCount:Int = 0
							If itname = "polyline"
							
	'Print ("object polyline: "+objectData.GetItem("polyline"))
								Local polyObjects:JSONArray = JSONArray(objectData.GetItem("polyline"))

								For Local polyObject:JSONDataItem = Eachin polyObjects
									Local polyData:JSONObject = JSONObject(polyObject)
									polyCount += 1
								Next
								mapObj.polyline = New Float[polyCount*2]
								polyCount = 0
								For Local polyObject:JSONDataItem = Eachin polyObjects
									Local polyData:JSONObject = JSONObject(polyObject)
	'Print ("polyline x: "+polyData.GetItem("x"))
	'Print ("polyline y: "+polyData.GetItem("y"))
									mapObj.polyline[polyCount] = polyData.GetItem("x") 
									mapObj.polyline[polyCount+1] = polyData.GetItem("y") 
									polyCount += 2
								Next
							Endif

							polyCount = 0
							If itname = "polygon"
							
	'Print ("object polygon: "+objectData.GetItem("polygon"))
								Local polyGObjects:JSONArray = JSONArray(objectData.GetItem("polygon"))

								For Local polyGObject:JSONDataItem = Eachin polyGObjects
									Local polyGData:JSONObject = JSONObject(polyGObject)
									polyCount += 1
								Next
								mapObj.polygon = New Float[polyCount*2]
								polyCount = 0
								For Local polyGObject:JSONDataItem = Eachin polyGObjects
									Local polyGData:JSONObject = JSONObject(polyGObject)
	'Print ("polygon x: "+polyGData.GetItem("x"))
	'Print ("polygon y: "+polyGData.GetItem("y"))
									mapObj.polygon[polyCount] = polyGData.GetItem("x") 
									mapObj.polygon[polyCount+1] = polyGData.GetItem("y") 
									polyCount += 2
								Next
							Endif


						Next
						
				    	obj.mapObjList.AddLast(mapObj)
				    Next
		        Endif
    		Endif
'Print("-----------------------------------------------------")	
		Next
		For Local ytY:Int = 1 To obj.tileCountY
			For Local ytX:Int = 1 To obj.tileCountX
				
				Local tilePos:Int = (ytX-1)+(ytY-1)*obj.tileCountX
				Local tileIDx:Int = obj.tileMap[tilePos].tileID
				'If tileIDx <> - 1 Then
'Print (ytX+":"+ytY+" = "+tileIDx)
					obj.tileMap[tilePos].column = ytX-1
					obj.tileMap[tilePos].row = ytY-1
					obj.tileMap[tilePos].sizeX = obj.tileSizeX
					obj.tileMap[tilePos].sizeY = obj.tileSizeY
					obj.tileMap[tilePos].xOff = obj.tileSizeX * (ytX-1)
					obj.tileMap[tilePos].yOff = obj.tileSizeY * (ytY-1)
				'Endif
			Next
		Next	

		obj.frameCount = obj.objImg.img.Frames()
		obj.frameStart = 1
		obj.frameEnd = obj.frameCount
		obj.frameLength = obj.frameEnd - obj.frameStart + 1
		'obj.radius = (Max(obj.objImg.img.Height(), obj.objImg.img.Width())*1.42)/2
		obj.radius = (Max(obj.objImg.img.Height(), obj.objImg.img.Width()))/2.0
		obj.w = obj.objImg.img.Width()
		obj.h = obj.objImg.img.Height()
		
		obj.rw = obj.w
		obj.rh = obj.h
		
		obj.SetLayer(Self.defaultLayer)
		obj.SetActive(Self.defaultActive)
		obj.SetVisible(Self.defaultVisible)
		
		obj.collType = -1
		obj.internal_RotateSpriteCol(obj)
		
		Return obj
	End
	
	'-----------------------------------------------------------------------------
#Rem
'summery:Creates a new timer. 
When the timer fires it will call OnTimer. A repeatCount of -1 will let the timer run forever.
#End
	Method CreateTimer:ftTimer(timerID:Int, duration:Int, repeatCount:Int = 0 )
		Local timer:ftTimer = New ftTimer
		timer.engine = Self
		timer.currTime = Self.time
		timer.duration = duration
		timer.id = timerID
		timer.intervall = duration
		timer.loop = repeatCount
		timer.obj = Null
		timer.timerNode = Self.timerList.AddLast(timer)
		Return timer
	End
	'-----------------------------------------------------------------------------
'changes:Changed in v1.52. The caluclation of the radius will be down from the max of height and width. And not from its corners anymore.
#Rem
'summery:Creates a new ZoneBox object which can be used for touch and collision checks. 
'Zone objects are invisble and can be used as collision objects. 
#End
	Method CreateZoneBox:ftObject(width:Float, height:Float, xpos:Float, ypos:Float)
		Local obj:ftObject = New ftObject
		obj.engine = Self
		obj.xPos = xpos
		obj.yPos = ypos
		obj.type = otZoneBox
		obj.isVisible = False
		'obj.radius = (Max(width,height)*1.42)/2.0
		obj.radius = (Max(width,height))/2.0
		obj.w = width
		obj.h = height
		
		obj.rw = obj.w
		obj.rh = obj.h
		
		obj.SetLayer(Self.defaultLayer)
		obj.SetActive(Self.defaultActive)
		obj.SetVisible(Self.defaultVisible)
		obj.collType = ctBound
		obj.internal_RotateSpriteCol(obj)
		Return obj
	End

	'------------------------------------------
'changes:Changed in v1.52. The caluclation of the radius will be down from the max of height and width. And not from its corners anymore.
#Rem
'summery:Creates a new ZoneCircle object which can be used for touch and collision checks.
'Zone objects are invisble and can be used as collision objects. 
#End
	Method CreateZoneCircle:ftObject(radius:Float, xpos:Float, ypos:Float)
		Local obj:ftObject = New ftObject
		obj.engine = Self
		obj.xPos = xpos
		obj.yPos = ypos
		obj.type = otZoneCircle
		obj.isVisible = False
		obj.radius = radius
		obj.w = obj.radius*2
		obj.h = obj.radius*2
		
		obj.rw = obj.w
		obj.rh = obj.h
		
		obj.SetLayer(Self.defaultLayer)
		obj.SetActive(Self.defaultActive)
		obj.SetVisible(Self.defaultVisible)
		obj.collType = ctCircle
		obj.internal_RotateSpriteCol(obj)
		Return obj
	End

	'------------------------------------------
'changes:Changed in version 1.51 to use mojo.EndApp
#Rem
'summery:Ends the application. 
#End
	Method ExitApp:Int(retCode:Int=0)
		'Error("")
		mojo.EndApp()
	End

	'------------------------------------------
#Rem
'summery:Return the X-axis value of the accelerator.
'This command returns the current value of the accelerometer for the X-axxis. To retrieve the Y-axxis, use GetAccelY. For the Z-axxis, use GetAccelZ. 
#End
	Method GetAccelX:Float()
			#If TARGET="android" Or TARGET="ios" Or TARGET="psm"
				Self.accelX = AccelX()
			#Else
				accelX = 0
				If KeyDown(KEY_LEFT) Then Self.accelX = -1
				If KeyDown(KEY_RIGHT) Then Self.accelX = 1
			#End
		Return accelX
	End

	'------------------------------------------
#Rem
'summery:Return the X and Y-axis value of the accelerator.
'This command returns the current values of the accelerometer for the X and Y-axxis. To retrieve the X-axxis, use GetAccelX. For the Z-axxis, use GetAccelZ. And to retrieve the Y-axxis, use GetAccelY. 
#End
	Method GetAccelXY:Float[]()
		#If TARGET="android" Or TARGET="ios" Or TARGET="psm"
			Self.accelX = AccelX()
			Self.accelY = AccelY()
		#Else
			accelX = 0
			accelY = 0
			If KeyDown(KEY_UP) Then Self.accelY = -1
			If KeyDown(KEY_DOWN) Then Self.accelY = 1
			If KeyDown(KEY_LEFT) Then Self.accelX = -1
			If KeyDown(KEY_RIGHT) Then Self.accelX = 1

		#End
		Return [Self.accelX, Self.accelY]
	End

	'------------------------------------------
#Rem
'summery:Return the Y-axis value of the accelerator.
'This command returns the current value of the accelerometer for the Y-axxis. To retrieve the X-axxis, use GetAccelX. For the Z-axxis, use GetAccelZ. 
#End
	Method GetAccelY:Float()
		#If TARGET="android" Or TARGET="ios" Or TARGET="psm"
			Self.accelY = AccelY()
		#Else
			accelY = 0
			If KeyDown(KEY_UP) Then Self.accelY = -1
			If KeyDown(KEY_DOWN) Then Self.accelY = 1
		#End
		Return accelY
	End

	'------------------------------------------
#Rem
'summery:Return the Z-axis value of the accelerator.
'This command returns the current value of the accelerometer for the Z-axxis. To retrieve the Y-axxis, use GetAccelY. For the X-axxis, use GetAccelX. 
#End
	Method GetAccelZ:Float()
		#If TARGET="android" Or TARGET="ios" Or TARGET="psm"
			Self.accelZ = AccelZ()
		#Else
			accelZ = 0
			If KeyDown(KEY_LEFT) Then Self.accelZ = -1
			If KeyDown(KEY_RIGHT) Then Self.accelZ = 1
		#End
		Return accelY
	End

	'------------------------------------------
#Rem
'summery:Returns the height of the canvas.
'To retrieve the current height of the canvas, use GetCanvasHeight. To get the width the canvas, use GetCanvasWidth. To set the size of the virtual canvas, use SetCanvasSize. 
#End
	Method GetCanvasHeight:Int()
		Return canvasHeight
	End	

	'------------------------------------------
#Rem
'summery:Returns the width of the canvas.
'To retrieve the current width of the canvas, use GetCanvasWidth. To get the height of the canvas, use GetCanvasHeight. To set the size of the virtual canvas, use SetCanvasSize. 
#End
	Method GetCanvasWidth:Int()
		Return canvasWidth
	End

	'------------------------------------------
#Rem
'summery:Returns the current default layer. 
'If you need to get the current layer where new objects are assigned to, then use GetDefaultLayer. To set the default layer, use SetDefaultLayer.
#End
	Method GetDefaultLayer:ftLayer()
		Return defaultLayer
	End

	'------------------------------------------
'changes:New in version 1.52
#Rem
'summery:Returns the current default scene. 
'If you need to get the current scene where new layers are assigned to, then use GetDefaultScene. To set the default layer, use SetDefaultScene.
#End
	Method GetDefaultScene:ftScene()
		Return defaultScene
	End

	'------------------------------------------
#Rem
'summery:Returns the delta time in milliseconds which was calculated with CalcDeltaTime.
#End
	Method GetDeltaTime:Int()
		Return deltaTime
	End

	'------------------------------------------
'changes:Removed the unused index parameter in version 1.51.
#Rem
'summery:Determines the current frames per second. 
'Retrieves the current FPS value which is updated with each call of CalcDeltaTime. 
#End
	Method GetFPS:Int()
		Local _currFPStime:Int
		_currFPStime = Self.GetTime()
		_ifps += 1
		If _currFPStime-_fpsTime>1000 Then
			_fps = _ifps
			_ifps = 0
			_fpsTime = _currFPStime
		Endif
		Return _fps
	End

	'-----------------------------------------------------------------------------
#Rem
'summery:Returns the number of objects. 
'Type=0 >>> All objects are counted
'Type=1 >>> Only active objects are counted
'Type=2 >>> Only visible objects are counted
#End
	Method GetObjCount:Int(type:Int = 0)
		Local oc:Int = 0
		For Local layer := Eachin layerList
			oc += layer.GetObjCount(type)
		Next
		Return oc
	End
	'------------------------------------------
'changes:Depreciated in version 1.51, use GetPaused instead.	
#Rem
'summery:Returns the isPaused flag of the engine. 
#End
	Method GetPause:Bool()
		Return Self.isPaused
	End
	'------------------------------------------
'changes:New in version 1.51.	
#Rem
'summery:Returns the isPaused flag of the engine. 
#End
	Method GetPaused:bool()
		Return Self.isPaused
	End

	'------------------------------------------
#Rem
'summery:Returns the X scale factor of the engine, which is set through SetCanvasSize.
'Depending on which mode you used with SetCanvasSize, the scale factor for the canvas will be set. With GetScaleX you can retrieve this factor. To retrieve the Y-scale factor, use GetScaleY.
#End
	Method GetScaleX:Float()
		Return scaleX
	End

	'------------------------------------------
#Rem
'summery:Returns the Y scale factor of the engine, which is set through SetCanvasSize.
'Depending on which mode you used with SetCanvasSize, the scale factor for the canvas will be set. With GetScaleY you can retrieve this factor. To retrieve the X-scale factor, use GetScaleX. 
#End
	Method GetScaleY:Float()
		Return scaleY
	End
	'------------------------------------------
#Rem
'summery:Returns engines own time.
'By default it is based on Millisecs and the timeScale factor. Overwrite this method to implement your own timer algorithym.
#End
	Method GetTime:Int()
		Local newMilliSecs:Int = Millisecs()
		Self.engineTime += (newMilliSecs - Self.lastMillisecs) * Self.timeScale
'Print Self.lastMillisecs+" : "+ newMilliSecs+" : "+engineTime
		Self.lastMillisecs = newMilliSecs
		Return engineTime
	End

	'------------------------------------------
#Rem
'summery:Returns engines own timeScale.
#End
	Method GetTimeScale:Float()
		Return Self.timeScale
	End

	'------------------------------------------
#Rem
'summery:Returns the X touch coordinate scaled by the engines X scale factor.
'The x-position of the finger with the given touch index. If you use a virtual canvas, the return value is scaled accordingly. To retrieve the Y-position, use GetTouchY. 
#End
	Method GetTouchX:Float(index:Int=0)
		Local ret:Float
		ret = (TouchX(index) - autofitX) / scaleX + camX
		Return ret
	End

	'------------------------------------------
#Rem
'summery:Returns the X/Y touch coordinate scaled by the engines scale factors.
'The return the position of the finger with the given touch index. If you use a virtual canvas, the return value is scaled accordingly. 
#End
	Method GetTouchXY:Float[](index:Int=0)
		Local retX:Float, retY:Float
		retX = (TouchX(index) - autofitX) / scaleX + camX
		retY = (TouchY(index) - autofitY) / scaleY + camY
		Return [retX, retY]
	End

	'------------------------------------------
#Rem
'summery:Returns the Y touch coordinate scaled by the engines Y scale factor.
'The y-position of the finger with the given touch index. If you use a virtual canvas, the return value is scaled accordingly. To retrieve the X-position, use GetTouchX. 
#End
	Method GetTouchY:Float(index:Int=0)
		Local ret:Float
		ret = (TouchY(index) - autofitY) / scaleY + camY
		Return ret
	End

	'------------------------------------------
#Rem
'summery:Returns the general volume of music. Ranges from 0.0 to 1.0.
#End
	Method GetVolumeMUS:Float()
		Return Self.volumeMUS
	End
	'------------------------------------------
#Rem
'summery:Returns the general volume of sound effects. Ranges from 0.0 to 1.0.
#End
	Method GetVolumeSFX:Float()
		Return Self.volumeSFX
	End
	'------------------------------------------
#Rem
'summery:Loads an EZGui compatible font.
#End
	Method LoadFont:ftFont(filename:String)
		Local font:ftFont = New ftFont
		font.Load(filename)
		fontList.AddLast(font)
		Return font
	End

	'-----------------------------------------------------------------------------
'changes:Changed in version 1.52. Uses image manager now.
#Rem
'summery:Loads an image like mogo.LoadImage, but also stores it in the fantomEngine image manager.
#End
	Method LoadImage:Image(path:String, frameCount:Int=1, flags:Int=Image.DefaultFlags)
		Local imgObj:ftImage = imgMng.LoadImage(path, frameCount, flags)
		Return imgObj.GetImage()
	End

	'-----------------------------------------------------------------------------
'changes:Changed in version 1.52. Uses image manager now.
#Rem
'summery:Loads an image like mogo.LoadImage, but also stores it in the fantomEngine image manager.
#End
	Method LoadImage:Image(path:String,  frameWidth:Int, frameHeight:Int, frameCount:Int, flags:Int=Image.DefaultFlags)
		Local imgObj:ftImage = imgMng.LoadImage(path, frameWidth, frameHeight, frameCount, flags)
		Return imgObj.GetImage()
	End

	'-----------------------------------------------------------------------------
#Rem
'summery:Load a music file with the given filename.
#End
	Method LoadMusic:ftSound(filename:String, loopFlag:Bool=False)
		Local snd:ftSound = New ftSound
		snd.engine = Self
		snd.name = filename
		snd.loop = loopFlag
		snd.isMusic = True
		snd.name = filename
		snd.soundNode = Self.soundList.AddLast(snd)

		Return snd
		
	End

	'-----------------------------------------------------------------------------
#Rem
'summery:Load a sound file with the given filename.
If you don't add a fileformat to the file name, then the default file format ist used.
The current default file formats are:
[list][*]GLFW = .wav
[*]HTML5 = .ogg
[*]FLASH = .mp3
[*]Android = .ogg
[*]XNA = .wav
[*]IOS = .m4a
[*]all the rest = .wav[/list] 
#End
	Method LoadSound:ftSound(filename:String, loopFlag:Bool=False)
		Local snd:ftSound = New ftSound
		snd.engine = Self
		snd.name = filename
		snd.loop = loopFlag
		snd.isMusic = False
		If filename.FindLast( "." )< 1 Then
#If TARGET="glfw"
			snd.sound = mojo.LoadSound(filename+".wav")
#Elseif TARGET="html5"
			snd.sound = mojo.LoadSound(filename+".ogg")
#Elseif TARGET="flash"
			snd.sound = mojo.LoadSound(filename+".mp3")
#Elseif TARGET="android"
			snd.sound = mojo.LoadSound(filename+".ogg")
#Elseif TARGET="xna"
			snd.sound = mojo.LoadSound(filename+".wav")
#Elseif TARGET="ios"
			snd.sound = mojo.LoadSound(filename+".m4a")
#Else
			snd.sound = mojo.LoadSound(filename+".wav")
#End
		Else
			snd.sound = mojo.LoadSound(filename)
		Endif
		snd.soundNode = Self.soundList.AddLast(snd)

		Return snd
		
	End

	'------------------------------------------
#Rem
'summery:Creates an instance of the fantomEngine.
#End
	Method New()
		Self.defaultLayer = New ftLayer
		Self.defaultLayer.engine = Self
		layerList.AddLast(Self.defaultLayer)

		Self.defaultScene = New ftScene
		Self.defaultScene.engine = Self
		sceneList.AddLast(Self.defaultScene)

		screenWidth = DeviceWidth()
		screenHeight = DeviceHeight()
		canvasWidth = screenWidth
		canvasHeight = screenHeight
		time = Self.GetTime()
		lastTime = time
		'Create the swipe detection class
		Self.swiper = New ftSwipe
		Self.swiper.engine = Self
		'Create the image manager class
		Self.imgMng = New ftImageManager
		Self.imgMng.engine = Self
		
	End

	'------------------------------------------
#Rem
'summery:This method is called when a layer finishes its update.
#End
	Method OnLayerTransition:Int(transId:Int, layer:ftLayer)
		Return 0
	End
	'------------------------------------------
#Rem
'summery:Callback method which is called when a layer is updated.
#End
	Method OnLayerUpdate:Int(layer:ftLayer)
		Return 0
	End	
	'------------------------------------------
#Rem
'summery:This method is called when an object collided with another object.
#End
	Method OnObjectCollision:Int(obj:ftObject, obj2:ftObject)
		Return 0
	End
	'------------------------------------------
#Rem
'summery:This method is called when an object is removed.
'You need to activate this callback via the ftObject.ActivateDeleteEvent method. The given parameter holds the instance of the object.
#End
	Method OnObjectDelete:Int(obj:ftObject)
		Return 0
	End
	'------------------------------------------
#Rem
'summery:This method is called when an object was being rendered.
'The OnObjectRender method is called, when an object got rendered via a call to ftEngine.Render, ftLayer.Render or ftObject.Render. The given parameter holds the instance of the object. 
'You need to activate this callback via the ftObject.ActivateRenderEvent method.
#End
	Method OnObjectRender:Int(obj:ftObject)
		Return 0
	End
	'------------------------------------------
#Rem
'summery:This method is called when objects are compared during a sort of its layer list.
'By default, objects are sorted ascending by the Z position.
'Overwrite this method with your own logic if you need something else. 
'Return TRUE if you want obj2 sorted infront of obj1.
#End
	Method OnObjectSort:Int(obj1:ftObject, obj2:ftObject)
		'If (obj1.yPos + obj1.GetHeight()/2) < (obj2.yPos + obj2.GetHeight()/2) Then 
		If (obj1.zPos) < (obj2.zPos) Then 
			Return False
		Else
			Return True
		Endif
	End
    '------------------------------------------
#Rem
'summery:This method is called when an objects' timer was being fired.
#End
	Method OnObjectTimer:Int(timerId:Int, obj:ftObject)
		Return 0
	End	
	'------------------------------------------
#Rem
'summery:This method is called when an object was touched.
#End
	Method OnObjectTouch:Int(obj:ftObject, touchId:Int)
		Return 0
	End
	'------------------------------------------
#Rem
'summery:This method is called when an object finishes its transition.
#End
	Method OnObjectTransition:Int(transId:Int, obj:ftObject)
		Return 0
	End
	'------------------------------------------
#Rem
'summery:This method is called when an object finishes its update.
'The OnObjectUpdate method is called, when an object got updated via a call to ftEngine.Update, ftLayer.Update or ftObject.Update. The given parameter holds the instance of the object. 
'You can deactivate this callback via the ftObject.ActivateUpdateEvent method.
#End
	Method OnObjectUpdate:Int(obj:ftObject)
		Return 0
	End

	'------------------------------------------
#Rem
'summery:This method is called, when a path marker reaches the end of the path and is about to bounce backwards.
#End
	Method OnMarkerBounce:Int(marker:ftMarker, obj:ftObject)
		Return 0
	End
	
	'------------------------------------------
#Rem
'summery:This method is called, when a path marker reaches the end of the path and is about to do another circle.
#End
	Method OnMarkerCircle:Int(marker:ftMarker, obj:ftObject)
		Return 0
	End
	
	'------------------------------------------
#Rem
'summery:This method is called, when a path marker reaches the end of the path and stops there.
#End
	Method OnMarkerStop:Int(marker:ftMarker, obj:ftObject)
		Return 0
	End

	'------------------------------------------
#Rem
'summery:This method is called, when a path marker reaches the end of the path and is about to warp to the start to go on.
#End
	Method OnMarkerWarp:Int(marker:ftMarker, obj:ftObject)
		Return 0
	End

	'------------------------------------------
#Rem
'summery:This method is called, when a path marker reaches a waypoint of its path.
#End
	Method OnMarkerWP:Int(marker:ftMarker, obj:ftObject)
		Return 0
	End
	
	'------------------------------------------
#Rem
'summery:This method is called when a swipe gesture was detected.
#End
	Method OnSwipeDone:Int(touchIndex:Int, sAngle:Float, sDist:Float, sSpeed:Float)
		Return 0
	End	
    '------------------------------------------
#Rem
'summery:This method is called when an engine timer was being fired.
#End
	Method OnTimer:Int(timerId:Int)
		Return 0
	End	
	'-----------------------------------------------------------------------------
'changes:New in v1.52. 
#Rem
'summery:Reloads all images. This is needed when you change the resolution in your game during runtime.
#End
	Method ReLoadAllImages:Void()
		Self.imgMng.ReLoadAllImages()
	End
	'-----------------------------------------------------------------------------
'changes:Changed in v1.52. Uses image manager now.
#Rem
'summery:Removes all images from the engine.
#End
	Method RemoveAllImages:Void(discard:Bool = False)
		Self.imgMng.RemoveAllImages(discard)
	End
	'------------------------------------------
#Rem
'summery:Remove all existing layer from engine.
#End
	Method RemoveAllLayer:Void()
		For Local layer := Eachin layerList.Backwards()
			layer.RemoveAllObjects()
			'layerList.RemoveEach(layer)
		Next
		layerList.Clear()	
	End
	'------------------------------------------
#Rem
'summery:Removes all objects from all layer.
#End
	Method RemoveAllObjects:Void()
		For Local layer := Eachin layerList
			layer.RemoveAllObjects()
		Next
	End
	'------------------------------------------
'changes:New in version 1.52.
#Rem
'summery:Remove all existing scenes from engine.
#End
	Method RemoveAllScenes:Void()
		For Local scene := Eachin sceneList.Backwards()
			scene.Remove()
		Next
	End
	'-----------------------------------------------------------------------------
'changes:Changed in v1.52. Uses image manager now.
#Rem
'summery:Removes an image from fantomEngine by the given Image handle.
#End
	Method RemoveImage:Void(image:Image, discard:Bool = False)
		Self.imgMng.RemoveImage(image, discard)
	End
	'-----------------------------------------------------------------------------
'changes:Changed in v1.52. Uses image manager now.
#Rem
'summery:Removes an image from fantomEngine by the given filename.
#End
	Method RemoveImage:Void(filepath:String, discard:Bool = False)
		Self.imgMng.RemoveImage(filepath, discard)
	End
	'------------------------------------------
'changes:Changed in version 1.51 to use list nodes.
#Rem
'summery:Removes a layer.
'Deletes a previously created layer and all the objects that are assigned to it. To create a layer, use CreateLayer. 
#End
	Method RemoveLayer:Void(layer:ftLayer)
		layer.RemoveAllObjects()
		'layerList.RemoveEach(layer)
		layer.Remove()
	End
	'------------------------------------------
'changes:New in version 1.52.
#Rem
'summery:Removes a scene.
'Deletes a previously created scene. To create a scene, use CreateScene. 
#End
	Method RemoveScene:Void(scene:ftScene)
		scene.Remove()
	End
	'------------------------------------------
#Rem
'summery:Renders all active and visible layers with their objects.
'Renders the objects of all or just one specific layer. The layer have to be active and visible. They are rendered in their order of creation. 
#End
	Method Render:Void()
'#If TARGET="html5"
		Self.red = 255
		Self.green = 255
		Self.blue = 255
		SetColor(255,255,255)
'#End
		PushMatrix
		Translate(autofitX, autofitY)
		Scale(scaleX, scaleY)
		SetScissor( autofitX, autofitY, canvasWidth*scaleX, canvasHeight*scaleY )
		For Local layer := Eachin layerList
			If layer.isVisible And layer.isActive Then layer.Render()
		Next
		PopMatrix
	End
	'------------------------------------------
#Rem
'summery:Renders all active and visible objects of a given layer.
#End
	Method Render:Void(layer:ftLayer)
'#If TARGET="html5"
		Self.red = 255
		Self.green = 255
		Self.blue = 255
		SetColor(255,255,255)
'#End
		PushMatrix
		Translate(autofitX, autofitY)
		Scale(scaleX, scaleY)
		SetScissor( autofitX, autofitY, canvasWidth*scaleX, canvasHeight*scaleY )

		If layer.isVisible And layer.isActive Then layer.Render()
		PopMatrix
	End
	'-----------------------------------------------------------------------------
'changes:New in version 1.51.
#Rem
'summery:Sets the current alpha to the engines stored alpha value.
'Use this when you have changed the alpha value manually via mojo.SetAlpha.
#End
	Method RestoreAlpha:Void()
		mojo.SetAlpha(self.alpha)
	End
	'-----------------------------------------------------------------------------
'changes:New in version 1.51.
#Rem
'summery:Sets the current blendmode to the engines stored blendmode.
'Use this when you have changed the blendmode manually via mojo.SetBlend.
#End
	Method RestoreBlendmode:Void()
		mojo.SetBlend(self.blendMode)
	End
	'-----------------------------------------------------------------------------
'changes:New in version 1.51.
#Rem
'summery:Sets the current color to the engines stored color values.
'Use this when you have changed the color manually via mojo.SetColor.
#End
	Method RestoreColor:Void()
		SetColor(Self.red,Self.green,Self.blue)
	End
	'-----------------------------------------------------------------------------
#Rem
'summery:Sets the camera to the given canvas positions.
'The camera in fantomEngine is basically and offset of the view to all visible objects. This command sets the X and Y-position of the camera. 
'If you use the relative flag, the cameras position is changed relatively by the given amount. 
'With positioning the camera, you can move your character freely inside the environment and you don't need to offset its layer anymore. 
'To set the X-Position, use SetCamX. For setting the Y position, use SetCamY. 
#End
	Method SetCam:Void (x:Float, y:Float, relative:Int = False )
		If relative = True
			camX = camX + x
			camY = camY + y
		Else
			camX = x
			camY = y
		Endif
	End
	'-----------------------------------------------------------------------------
#Rem
'summery:Sets the cameras X coordinate to the given canvas position.
'The camera in fantomEngine is basically and offset of the view to all visible objects. This command sets the X-position of the camera. 
'If you use the relative flag, the cameras position is changed relatively by the given amount. 
'With positioning the camera, you can move your character freely inside the environment and you don't need to offset its layer anymore. 
'To set the Y-Position, use SetCamY. For setting the X and Y position together, use SetCam. 
#End
	Method SetCamX:Void (x:Float, relative:Int = False )
		If relative = True
			camX = camX + x
		Else
			camX = x
		Endif
	End
	'-----------------------------------------------------------------------------
#Rem
'summery:Sets the cameras Y coordinate to the given canvas position.
'The camera in fantomEngine is basically and offset of the view to all visible objects. This command sets the Y-position of the camera. 
'If you use the relative flag, the cameras position is changed relatively by the given amount. 
'With positioning the camera, you can move your character freely inside the environment and you don't need to offset its layer anymore. 
'To set the X-Position, use SetCamX. For setting the X and Y position together, use SetCam. 
#End
	Method SetCamY:Void (y:Float, relative:Int = False )
		If relative = True
			camY = camY + y
		Else
			camY = y
		Endif
	End
	'------------------------------------------
'changes:Fixed in v1.52 to read the device width and height at each call.
#Rem
'summery:Sets the virtual canvas size to the given width/height.
'With this command, you set the virtual dimensions of your canvas. If the size of your devices canvas will differ from your settings, fantomEngine will scale the drawing and touch input accordingly. 
'You can retrieve the scale factors with GetScaleY and GetScaleX. 
'If you want to act automatically on device rotations, call SetCanvasSize inside the ftEngine.OnUpdate method.
<b>Canvas scale modes</b>

The canvas scale modes are implemented as constants. Next you see which exist and what they do:
[list][*]ftEngine.cmZoom 	(Value=0, Old behaviour, canvas will be streched/fitted into the screen. )
[*]ftEngine.cmCentered 	(Value=1, Pixel perfect, canvas will be centered into the screen space. No content scaling.  )
[*]ftEngine.cmLetterbox 	(Value=2, Default. Canvas will be scaled to the smaller scale factor of X or Y. )
[*]ftEngine.cmPerfect 	(Value=3, Pixel perfect (Top left). No content/Canvas scaling. )[/list]
#End
	Method SetCanvasSize:Void(width:Int, height:Int, canvasmode:Int = ftEngine.cmLetterbox)
'Print ("Scale:   "+self.scaleX+":"+self.scaleY+"  |  screen:  "+self.screenWidth+":"+self.screenHeight+"  |  canvas:  "+self.canvasWidth+":"+self.canvasHeight+"  |  device:  "+DeviceWidth()+":"+DeviceHeight())
		screenWidth = DeviceWidth()
		screenHeight = DeviceHeight()
		canvasWidth = screenWidth
		canvasHeight = screenHeight
'Print ("Scale:   "+self.scaleX+":"+self.scaleY+"  |  screen:  "+self.screenWidth+":"+self.screenHeight+"  |  canvas:  "+self.canvasWidth+":"+self.canvasHeight+"  |  device:  "+DeviceWidth()+":"+DeviceHeight())
		Local dx:Int = screenWidth - width
		Local dy:Int = screenHeight - height
		If canvasmode > 3 Or canvasmode < 0 Then Error ("~n~nError in method ftEngine.SetCanvasSize.~n~nInvalid mode value = "+canvasmode)
		canvasWidth = width
		canvasHeight = height
		If canvasmode = 0 Then
			scaleX = screenWidth / canvasWidth
			scaleY = screenHeight / canvasHeight
		Elseif canvasmode = 1 Then
			autofitX = (screenWidth - canvasWidth)/2
			autofitY = (screenHeight - canvasHeight)/2
		Elseif canvasmode = 2 Then
			scaleX = screenWidth / canvasWidth
			scaleY = screenHeight / canvasHeight
			If scaleX > scaleY Then 
				scaleX = scaleY
			Else
				scaleY = scaleX
			Endif
			autofitX = ((screenWidth - (canvasWidth*scaleX))/2) 
			autofitY = ((screenHeight - (canvasHeight*scaleY))/2)
		Endif
'Print ("Scale:   "+self.scaleX+":"+self.scaleY+"  |  screen:  "+self.screenWidth+":"+self.screenHeight+"  |  canvas:  "+self.canvasWidth+":"+self.canvasHeight+"  |  device:  "+DeviceWidth()+":"+DeviceHeight())
	End
	'------------------------------------------
#Rem
'summery:Sets the default active flag for newly created objects.
'All newly created objects are active by default. Use SetDefaultActive to set the default behaviour of the fantomEngine. 
#End
	Method SetDefaultActive:Void(active:Bool)
		defaultActive = active
	End
	'------------------------------------------
#Rem
'summery:Sets the default layer which is assigned to all newly created objects.
'If you need to set the default layer where new objects are assigned to, then use [b]SetDefaultLayer[/b]. To get the default layer, use [b]GetDefaultLayer[/b]. 
#End
	Method SetDefaultLayer:Void(layer:ftLayer)
		defaultLayer = layer
	End
	'------------------------------------------
#Rem
'summery:Sets the default scene which is assigned to all newly created layers.
'If you need to set the default scene where new layers are assigned to, then use [b]SetDefaultScene[/b]. To get the default layer, use [b]GetDefaultScene[/b]. 
#End
	Method SetDefaultScene:Void(scene:ftScene)
		defaultScene = scene
	End
	'------------------------------------------
#Rem
'summery:Sets the default visible flag for newly created objects.
'All newly created objects are visible by default. Use SetDefaultVisible to set the default behaviour of the fantomEngine. 
#End
	Method SetDefaultVisible:Void(visible:Bool)
		defaultVisible = visible
	End
	'------------------------------------------
'changes:New in version 1.52
#Rem
'summery:Sets the index of the first sound channel to be used. Ranges from 0 to 31.
#End
	Method SetFirstSoundChannel:Void(firstChannel:Int = 0)
		If firstChannel < 0 Or firstChannel > 31 Then Error ("~n~nError in file fantomEngine.cftEngine, Method ftObject.SetFirstSoundChannel(firstChannel:Int = 0)):~n~nUsed firstChannel value is wrong. Bounds are 0-31.")
		Self.firstSoundChannel = firstChannel
		Self.maxSoundChannel = Min(32, Self.maxSoundChannel+Self.firstSoundChannel)
	End
	'------------------------------------------
'changes:Changed in version 1.52
#Rem
'summery:Sets the maximum number of sound channels to be used. Ranges from 1 to 32.
If a low end device device has performance problems, lower this setting.
#End
	Method SetMaxSoundChannel:Void(maxChannel:Int = 32)
		If maxChannel < 1 Or maxChannel > 32 Then Error ("~n~nError in file fantomEngine.cftEngine, Method ftObject.SetMaxSoundChannel(maxChannel:Int = 32):~n~nUsed maxChannel value is wrong. Bounds are 1-32.")
		Self.maxSoundChannel = maxChannel
		Self.maxSoundChannel = Min(32, Self.maxSoundChannel+Self.firstSoundChannel)
	End
	'------------------------------------------
'changes:Depreciated in version 1.51. Use SetPaused instead.	
#Rem
'summery:With this method, you can pause the engine or resume it.
'If the engine is paused, objects, timers and transitions won't be updated.
#End
	Method SetPause:Void(pauseFlag:Bool)
		If Self.isPaused <> pauseFlag Then
			Self.isPaused = pauseFlag
			Self.GetTime()
			If pauseFlag = True Then
				Self.oldtimeScale = Self.timeScale
				Self.timeScale = 0
			Else
				Self.timeScale = Self.oldtimeScale
			Endif
		Endif
	End
	'------------------------------------------
'changes:New in version 1.51.
#Rem
'summery:With this method, you can pause the engine or resume it.
'If the engine is paused, objects, timers and transitions won't be updated.
#End
	Method SetPaused:Void(pauseFlag:Bool)
		If Self.isPaused <> pauseFlag Then
			Self.isPaused = pauseFlag
			Self.GetTime()
			If pauseFlag = True Then
				Self.oldtimeScale = Self.timeScale
				Self.timeScale = 0
			Else
				Self.timeScale = Self.oldtimeScale
			Endif
		Endif
	End
	'------------------------------------------
#Rem
'summery:Only swipes that are longer than the dead distance are detected.
#End
	Method SetSwipeDeadDist:Void(deadDist:Float = 20.0)
		swiper.deadDist = deadDist
	End
	'------------------------------------------
#Rem
'summery:You can let the swipe angle snap to a fraction of a given degree.
#End
	Method SetSwipeSnap:Void(degrees:Int=1)
		swiper.angleSnap = degrees
	End
	'------------------------------------------
#Rem
'summery:The time scale influences the update methods of objects, timers and transitions.
Lower values than 1.0 slow down the engine, bigger values speed it up.
#End
	Method SetTimeScale:Void(timescale:Float = 1.0)
		Self.timeScale = timescale
	End
	'------------------------------------------
#Rem
'summery:Sets the general volume of music. Ranges from 0.0 to 1.0.
#End
	Method SetVolumeMUS:Void(volume:Float = 1.0)
		Self.volumeMUS = volume
		For Local snd := Eachin Self.soundList
			If snd.isMusic = True Then
				snd.SetVolume(snd.GetVolume())
			Endif
		Next
	End
	'------------------------------------------
#Rem
'summery:Sets the general volume of sound effects. Ranges from 0.0 to 1.0.
#End
	Method SetVolumeSFX:Void(volume:Float = 1.0)
		Self.volumeSFX = volume
		For Local snd := Eachin Self.soundList
			If snd.isMusic = False Then
				snd.SetVolume(snd.GetVolume())
			Endif
		Next
	End
	'------------------------------------------
#Rem
'summery:Sort the objects of all layer.
'Internally it will call the [b]ftEngine.OnObjectSort[/b] method. Override this method with your on comparison algorythm. 
#End
	Method SortObjects:Void()
		For Local layer := Eachin layerList
			If layer.isActive Then layer.SortObjects()
		Next
	End
	'------------------------------------------
#Rem
'summery:Sort the objects inside a layer.
'Internally it will call the [b]ftEngine.OnObjectSort[/b] method. Override this method with your on comparison algorythm. 
#End
	Method SortObjects:Void(layer:ftLayer)
		If layer.isActive Then layer.SortObjects()
	End
	'------------------------------------------
#Rem
'summery:Call SwipeUpdate in every mojo.OnUpdate event after the regular ftEngine.Update method.
'If a swipe was detected, it will call the [b]ftEngine.OnSwipeDone[/b] method.
#End
	Method SwipeUpdate:Void(index:Int = 0)
		If swiper.swipeActive = True Then
			swiper.Update(index)
		Endif
	End
	'------------------------------------------
#Rem
'summery:Do a touch check over all layers and their active objects which have a touch method assigned to them.
#End
	Method TouchCheck:Void(touchID:Int=0)
		Local px:Float = GetTouchX(touchID)
		Local py:Float = GetTouchY(touchID)
		For Local layer := Eachin layerList
			If layer.isGUI = True Then
				If layer.isActive Then layer.TouchCheck(px-Self.camX, py-Self.camY, touchID)
			Else
				If layer.isActive Then layer.TouchCheck(px, py, touchID)
			Endif
		Next
	End
	'------------------------------------------
#Rem
'summery:Do a touch check over all active objects of a given layer which have a touch method assigned to them.
#End
	Method TouchCheck:Void(layer:ftLayer, touchID:Int=0)
		Local px:Float = GetTouchX(touchID)
		Local py:Float = GetTouchY(touchID)
		If layer.isActive Then layer.TouchCheck(px, py, touchID)
	End
	'------------------------------------------
#Rem
'summery:Updates all general timers and active layers with their transitions and objects.
'Update all objects of the engine which are not children of another object. That means that the objects move and turn according to their speed, speed angle and spin properties. 
'After an object was updated, the [b]ftEngine.OnObjectUpdate[/b] method will be called. Child objects are updated together with and right after their parent objects.
#End
	Method Update:Void(speed:Float=1.0)
		time = Self.GetTime()
		For Local timer:ftTimer = Eachin timerList.Backwards()
			timer.Update()
		Next

		For Local layer := Eachin layerList
			If layer.isActive Then layer.Update(speed)
		Next
	End
	'------------------------------------------
#Rem
'summery:Updates all general timer and a given layer with its transitions and active objects.
'Update all objects of the specified layer which are not children of another object. That means that the objects move and turn according to their speed, speed angle and spin properties. 
'After an object was updated, the [b]ftEngine.OnObjectUpdate[/b] method will be called. Child objects are updated together with and right after their parent objects.
#End
	Method Update:Void(layer:ftLayer, speed:Float=1.0)
		time = Self.GetTime()
		For Local timer:ftTimer = Eachin timerList.Backwards() 
			timer.Update()
		Next
		If layer.isActive Then layer.Update(speed)
	End

	'-----------------------------------------------------------------------------
'#DOCOFF#
	Method _StripDir:String( path:String )
		Local i=path.FindLast( "/" )
		If i=-1 i=path.FindLast( "\" )
		If i<>-1 Return path[i+1..]
		Return path
	End
'#DOCON#'

End


#Rem
footer:This fantomEngine framework is released under the MIT license:
[quote]Copyright (c) 2011-2013 Michael Hartlef

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, and to permit persons to whom the software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
[/quote]
#End