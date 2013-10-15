Strict
Import fantomEngine
Global g:game
Class game Extends App
	Const gmMenu:Int =1
	Const gmPlay:Int =2
	Const gmGameOver:Int =3
	Const gmScoreList:Int =4
	Const gmPause:Int = 5
	
	Const cmSmall:Int = 1
	Const cmMedium:Int = 2
	Const cmLarge:Int = 3
	
	Const grpShot:Int = 1
	Const grpComet:Int = 2
	Const grpPlayer:Int = 3
	Const grpShield:Int = 6
	Const grpBoss:Int = 10
	
	Const tmObjRemove:Int = 2
	Const tmShieldTime:Int = 3
	Const tmBossTime:Int = 4
	
	Field eng:engine
	Field obj:ftObject
	Field player:ftObject
	Field shield:ftObject
	Field txtScore:ftObject
	Field txtLives:ftObject
	Field txtLevel:ftObject
	Field txtComets:ftObject
	Field boss:ftObject
	Field txtHighScores:ftObject[10]
	Field font1:ftFont
	Field layerBackground:ftLayer
	Field layerGame:ftLayer
	Field layerUI:ftLayer
	Field layerFX:ftLayer
	Field layerTitle:ftLayer
	Field layerScore:ftLayer
	Field sndExplo:ftSound
	Field sndShot:ftSound 
	Field atlas:Image
	Field cometCount:Int
	Field levelNumber:Int
	Field score:Int
	Field lives:Int
	Field gameMode:Int = gmMenu
	Field lastTime:Int
	Field deltaTime:Int
	Method OnCreate:Int()
		SetUpdateRate(60)
		eng = New engine
		atlas = LoadImage("cctiles.png")
		CreateLayers()
		CreateStars(60)
		CreatePlayer()
		LoadSounds()
		font1 = eng.LoadFont("cc_font")
		CreateInfoText()
		CreateTitleScreen()
		CreateHighScoreList()
		Return 0
	End
	Method OnUpdate:Int()
		Select gameMode
			Case gmPlay
				If KeyHit(KEY_P) Then
					PauseGame()
				Else
					eng.Update(Float(UpdateGameTime())/60.0)
					eng.CollisionCheck(layerGame)
					UpdateInfoText()
				Endif
			Case gmMenu, gmGameOver
				If KeyHit(KEY_P) Then
					StartNewGame()
				Endif
				If KeyHit(KEY_H) Then
					ShowScoreList()
				Endif
			Case gmScoreList
				If KeyHit(KEY_P) Then
					StartNewGame()
				Endif
			Case gmPause
				If KeyHit(KEY_P) Then
					eng.Update(0)
					gameMode = gmPlay
				Endif				
		End
		Return 0
	End
	Method PauseGame:Int()
		gameMode = gmPause
		Return 0
	End
	Method OnRender:Int()
		Cls
		eng.Render()
		Return 0
	End
	Method CreateLayers:Int()
		layerBackground = eng.CreateLayer()
		layerGame = eng.CreateLayer()
		layerFX = eng.CreateLayer()
		layerUI = eng.CreateLayer()
		layerTitle = eng.CreateLayer()
		layerScore = eng.CreateLayer()
		Return 0
	End
	Method CreateBoss:Int()
		Local xp:Int =Rnd(0,eng.canvasWidth)
		Local yp:Int =Rnd(0,eng.canvasHeight)
		boss = eng.CreateImage(atlas, 0,64,32,32, xp - 64, yp - 64)
		boss.SetRadius(4)
		boss.SetSpeed(10)
		boss.SetWrapScreen(True)
		boss.SetLayer(layerGame)
		boss.SetColGroup(grpBoss)
		boss.SetID(grpBoss)
		boss.SetColWith(grpPlayer, True)
		Return 0
	End
	Method CreateStars:Int(count : Int)
		For Local i:Int = 1 To count
			Local star:ftObject = eng.CreateImage(atlas,16,112,16,16,Rnd(0,eng.canvasWidth),Rnd(0,eng.canvasHeight))
			star.SetScale(Rnd(1,3)/10)
			star.SetAngle(Rnd(0,359))
			star.SetSpin(5)
			star.SetLayer(layerBackground)
		Next
		Return 0
	End
	Method CreatePlayer:Int()
		player = eng.CreateImage(atlas,0,0,32,32,0,0)
		player.SetFriction(0.2)
		player.SetMaxSpeed(20.0)
		player.SetWrapScreen(True)
		player.SetLayer(layerGame)
		player.SetColGroup(grpPlayer)
		player.SetColWith(grpComet, True)
		player.SetColWith(grpBoss,True)
		player.SetRadius(12)
		player.SetActive(False)
		shield = eng.CreateImage(atlas,32,96,32,32,0,0)
		shield.SetScale(2.0)
		shield.SetSpin(15)
		shield.SetLayer(layerGame)
		shield.SetParent(player)
		shield.SetColGroup(grpShield)
		shield.SetColWith(grpComet, True)
		shield.SetRadius(13)
		shield.SetActive(False)
		Return 0
	End
	Method LoadSounds:Int()
		sndExplo = eng.LoadSound("explosion")
		sndShot = eng.LoadSound("shoot1")
		Return 0
	End
	Method CreateInfoText:Int()
		txtScore = eng.CreateText(font1,"Score:    " + score,0,0)
		txtScore.SetLayer(layerUI)
		txtLevel = eng.CreateText(font1,"Level:    " + levelNumber, eng.canvasWidth-5, 0,2)
		txtLevel.SetLayer(layerUI);
		txtComets = eng.CreateText(font1,"Comets:    " + cometCount,0,eng.canvasHeight-font1.lineHeight)
		txtComets.SetLayer(layerUI)
		txtLives = eng.CreateText(font1,"Lives:    " + lives,eng.canvasWidth-5,eng.canvasHeight-font1.lineHeight,2)
		txtLives.SetLayer(layerUI)
		Return 0
	End
	Method CreateTitleScreen:Int ()
		Local txtTitle:ftObject = eng.CreateText(font1,"RockSmash",eng.canvasWidth/2,eng.canvasHeight/2-40,1)
		txtTitle.SetLayer(layerTitle)
		Local txtTitle2:ftObject = eng.CreateText(font1,"*** Press 'P' to play ***",eng.canvasWidth/2,eng.canvasHeight/2+10,1)
		txtTitle2.SetLayer(layerTitle)
		Local txtTitle3:ftObject = eng.CreateText(font1,"*** Press 'H' to see the highscore list ***",eng.canvasWidth/2,eng.canvasHeight/2+40,1)
		txtTitle3.SetLayer(layerTitle)
		Return 0
	End
	Method CreateHighScoreList:Int ()
		Local txtTitleHightScore:ftObject = eng.CreateText(font1,"H I G H S C O R E S",eng.canvasWidth/2,70,1)
		txtTitleHightScore.SetLayer(layerScore)
		For Local y:Int = 1 To 10
			Local txtScoreNum:ftObject = eng.CreateText(font1,"#"+y,eng.canvasWidth/4+50,80 + (eng.canvasHeight/20)*y)
			txtScoreNum.SetLayer(layerScore)
			txtHighScores[y-1] = eng.CreateText(font1,"0000000",(eng.canvasWidth/4)*3-50,80 + (eng.canvasHeight/20)*y,2)
			txtHighScores[y-1].SetLayer(layerScore)
		Next
		layerScore.SetActive(False)
		Return 0
	End
	Method CreateComet:ftObject(k:Int, xp:Float, yp:Float, speed:Float, speedAngle:Float)
		Local com:ftObject
		If k = cmSmall Then 
			com = eng.CreateImage(atlas, 0,32,16,16, xp, yp)
			com.SetRadius(4)
		Endif	 
		If k = cmMedium Then 
			com = eng.CreateImage(atlas, 32,0,32,32, xp, yp)	
			com.SetRadius(12)
		Endif 
		If k = cmLarge Then 
			Local imgRnd:Int = Rnd(0,99)
			If imgRnd > 49 Then
				com = eng.CreateImage(atlas, 64,0,64,64, xp, yp)	
			Else
				com = eng.CreateImage(atlas, 64,64,64,64, xp, yp)	
			Endif
			com.SetRadius(24)	
		Endif
		com.SetSpeed(speed, speedAngle)
		com.SetAngle(Rnd(0,359))
		com.SetSpin(Rnd(-5,5))
		com.SetTag(k)
		com.SetWrapScreen(True)
		com.SetLayer(layerGame)
		com.SetColGroup(grpComet)
		com.SetID(grpComet)
		cometCount += 1
		Return com 
	End
	Method SpawnComets:Int (ccount:Int)
		For Local i:Int = 1 To ccount
			obj = CreateComet(cmLarge,Rnd(64,eng.canvasWidth-64),Rnd(64,eng.canvasHeight-64),Rnd(1,levelNumber+4)/2,Rnd(0,359))
		Next
		Return 0
	End
	Method LoadHighScore:Int ()
		Local state:String = LoadState()
		If state Then
			eng.scoreList.LoadFromString(state)
		Endif
		Return 0
	End
	Method ShowScoreList:Int()
		LoadHighScore()
		For Local y:Int = 1 To eng.scoreList.Count()
			txtHighScores[y-1].SetText(eng.scoreList.GetValue(y))
		Next
		layerScore.SetActive(True)
		layerTitle.SetActive(False)
		Return 0
	End
	Method ActivateShield:Int()
		eng.CreateObjTimer(g.shield, g.tmShieldTime, 4500)
		g.player.SetColGroup(0)
		g.shield.SetActive(True)
		Return 0
	End
	Method UpdateGameTime:Int()
		If gameMode = gmPlay Then
			deltaTime = Millisecs() - lastTime
			lastTime  += deltaTime
			Return deltaTime
		Endif
		Return 0
	End
	Method UpdateInfoText:Int()
		txtScore.SetText("Score:   "+score)
		txtComets.SetText("Comets:  "+cometCount)
		txtLevel.SetText("Level:   "+levelNumber)
		txtLives.SetText("Lives:   "+lives)
		Return 0
	End
	Method StartNewGame:Int()
		cometCount = 0
		lives = 3
		score = 0
		levelNumber = 1
		layerTitle.SetActive(False)
		layerScore.SetActive(False)
		player.SetPos(eng.canvasWidth/2,eng.canvasHeight/2)
		player.SetAngle(0.0)
		player.SetSpeed(0)
		player.SetActive(True)
		ActivateShield()
		SpawnComets(5)
		eng.CreateObjTimer(obj, tmBossTime, 1000 + Rnd(0,10000))
		gameMode = gmPlay
		Return 0
	End	
	Method SpawnPlayerEngine:Int()
		Local d:Float[] = player.GetVector(20,180.0+player.angle)
		obj = eng.CreateImage(atlas, 16,96,16,16, d[0],d[1])
		obj.SetAngle(player.angle)
		obj.SetScale(0.5)
		obj.SetLayer(layerFX)
		eng.CreateObjTimer(obj, tmObjRemove, 100)
		Return 0
	End
	Method SpawnExplosion:Int(c:Int, xp:Float, yp:Float)
		For Local i:Int = 1 To c
			Local explo:ftObject = eng.CreateImage(atlas, 0,112,16,16, xp, yp)	
			explo.SetScale(Rnd(3,15)/10) 
			explo.SetAngle(Rnd(0,359))
			explo.SetSpin(Rnd(-4,4))
			explo.SetSpeed(Rnd(1,2))
			explo.SetLayer(layerFX)
			eng.CreateObjTimer(explo, tmObjRemove, Rnd(100,2000))
		Next
		sndExplo.Play()
		Return 0 
	End
	Method SpawnPlayerShot:Int()
		Local ds:Float[] = player.GetVector(20, player.angle)
		Local sht:ftObject = eng.CreateImage(atlas, 0,96,16,16, ds[0],ds[1])
		sht.SetAngle(player.angle)
		sht.SetMaxSpeed(25.0)
		sht.SetSpeed(player.speed+10.0)
'		sht.SetScale(0.5)
		sht.SetLayer(layerGame)
		sht.SetWrapScreen(True)
		eng.CreateObjTimer(sht, tmObjRemove, 2100)
		sht.SetColGroup(grpShot)
		sht.SetColWith(grpComet, True)
		sht.SetRadius(3)
		sndShot.Play()
		Return 0
	End
	Method SaveHighScore:Int ()
		Local hs:String = g.eng.scoreList.SaveToString()
		SaveState(hs)
		Return 0
	End

End
Function Main:Int()
	g = New game
	Return 0
End

Class engine Extends ftEngine	
	Method OnObjectCollision:Int(obj:ftObject, obj2:ftObject)
		Local i:Int
		If obj2.collGroup = g.grpComet Then
			If obj2.tag = g.cmLarge Then
				g.SpawnExplosion(15,obj.xPos, obj.yPos)
				For i = 1 To 2
					g.CreateComet(g.cmMedium,obj2.xPos, obj2.yPos, Rnd(1,g.levelNumber+5)/2,Rnd(0,359))
				Next
				g.score = g.score + 100
			Endif
			If obj2.tag = g.cmMedium Then
				g.SpawnExplosion(10,obj.xPos, obj.yPos)
				For i = 1 To 4
					g.CreateComet(g.cmSmall,obj2.xPos, obj2.yPos, Rnd(1,g.levelNumber+6)/2,Rnd(0,359))
				Next
				g.score = g.score + 250
			Endif
			If obj2.tag = g.cmSmall Then
				g.SpawnExplosion(5,obj.xPos, obj.yPos)
				g.score = g.score + 500
			Endif
			g.cometCount -= 1
			obj2.Remove()
		Endif
		If obj.collGroup = g.grpShot Then
			obj.Remove()
		Endif
		If obj.collGroup = g.grpPlayer Then
			g.SpawnExplosion(5,obj.xPos, obj.yPos)
			g.lives -= 1
			obj2.Remove()
		Endif
		If obj2.collGroup = g.grpBoss Then
			obj2.Remove()	
		Endif
		If obj2.collGroup = g.grpBoss Then
			Print("Boss Hit")
		Endif
		Return 0
	End
	Method OnObjectTimer:Int(timerId:Int, obj:ftObject)
		If timerId = g.tmObjRemove Then
			obj.Remove()
		Endif
		If timerId = g.tmShieldTime Then
			obj.SetActive(False)
			g.player.SetColGroup(g.grpPlayer)
		Endif
		If timerId = g.tmBossTime Then
'			g.CreateBoss()
		Endif
		Return 0
	End
	Method OnObjectUpdate:Int(obj:ftObject)
		If g.gameMode = g.gmPlay
			If obj = g.player Then 
				If KeyDown(KEY_UP)
					obj.AddSpeed(1.5*delta)
					g.SpawnPlayerEngine()
				Endif
				If KeyDown(KEY_LEFT)
					obj.SetAngle(-15.0 * delta,True)
				Endif
				If KeyDown(KEY_RIGHT)
					obj.SetAngle(15.0 * delta,True)
				Endif
				If KeyHit(KEY_S)
					g.SpawnPlayerShot()
				Endif
				If KeyHit(KEY_SPACE) And g.shield.isActive= False Then
					g.ActivateShield()
				Endif
			Endif
		Endif
		Return 0
	End
	Method OnLayerUpdate:Int(layer:ftLayer)
		If layer = g.layerGame And g.gameMode = g.gmPlay Then
			If g.lives <= 0 Then
				g.gameMode = g.gmGameOver
				g.layerTitle.SetActive(True)
				g.eng.scoreList.AddScore(g.score,"---")
				g.player.SetActive(False)
				g.layerFX.RemoveAllObjects()
				layer.RemoveAllObjectsByID(g.grpComet)
				g.SaveHighScore()
				Return 0
			Endif
			If g.cometCount <= 0 And g.gameMode = g.gmPlay Then
				g.ActivateShield()
				g.levelNumber += 1
				g.SpawnComets(4+g.levelNumber)
				g.lives += 1
			Endif
		Endif
		Return 0
	End
	
End