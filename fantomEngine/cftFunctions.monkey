#rem
	Title:        fantomEngine
	Description:  A 2D game framework for the Monkey programming language
	
	Author:       Michael Hartlef
	Contact:      michaelhartlef@gmail.com
	
	Repository:   http://code.google.com/p/fantomengine/
	
	License:      MIT
#End

#Rem
'nav:<blockquote><nav><b>fantomEngine documentation</b> | <a href="index.html">Home</a> | <a href="classes.html">Classes</a> | <a href="3rdpartytools.html">3rd party tools</a> | <a href="examples.html">Examples</a> | <a href="changes.html">Changes</a></nav></blockquote>
#End
'header:The module cftFunctions is a collection of several functions for IOS, ANDROID and HTML5 targets to retrieve some browser informations.

#if HOST="macos" And TARGET="glfw"
	'Import "native/fantomengine.${TARGET}.mac.${LANG}"
#elseif TARGET="android" Or TARGET="ios" Or TARGET="html5"
	Import "native/fantomengine.${TARGET}.${LANG}"
#else 
	'Import "native/fantomengine.${TARGET}.${LANG}"
#end

'Import mojo

Extern
'#DOCOFF#
	#If TARGET = "android" Then
		Function GetDeviceName:String() = "fantomengine.DeviceName"
		Function GetHardware:String() = "fantomengine.Hardware"
		Function GetUser:String() = "fantomengine.User"
		Function GetProduct:String() = "fantomengine.Product"
		Function GetSerial:String() = "fantomengine.Serial"
		Function GetBrowserName:String() = "fantomengine.GetBrowserName"
		Function GetBrowserVersion:String() = "fantomengine.GetBrowserVersion"
		Function GetBrowserPlatform:String() = "fantomengine.GetBrowserPlatform"
	#ElseIf TARGET = "ios" Then
		Function GetDeviceName:String() = "fantomengine::DeviceName"
		Function GetHardware:String() = "fantomengine::Hardware"
		Function GetUser:String() = "fantomengine::User"
		Function GetProduct:String() = "fantomengine::Product"
		Function GetSerial:String() = "fantomengine::Serial"
		Function GetBrowserName:String() = "fantomengine::GetBrowserName"
		Function GetBrowserVersion:String() = "fantomengine::GetBrowserVersion"
		Function GetBrowserPlatform:String() = "fantomengine::GetBrowserPlatform"
	#ElseIf TARGET = "html5" Then
		Function GetDeviceName:String() = "fantomengine.DeviceName"
		Function GetHardware:String() = "fantomengine.Hardware"
		Function GetUser:String() = "fantomengine.User"
		Function GetProduct:String() = "fantomengine.Product"
		Function GetSerial:String() = "fantomengine.Serial"
		Function GetBrowserName:String() = "fantomengine.GetBrowserName"
		Function GetBrowserVersion:String() = "fantomengine.GetBrowserVersion"
		Function GetBrowserPlatform:String() = "fantomengine.GetBrowserPlatform"
		Function MaximizeCanvas:Void() = "fantomengine.MaximizeCanvas"
	#Endif
Public
'#DOCON#
	#If TARGET <> "android" And TARGET <> "ios" And TARGET <> "html5" Then
		Function GetDeviceName:String()
			Local s:String = "---"
			Return s
		End
		Function GetHardware:String()
			Local s:String = "---"
			Return s
		End
		Function GetUser:String()
			Local s:String = "---"
			Return s
		End
		Function GetProduct:String()
			Local s:String = "---"
			Return s
		End
		Function GetSerial:String()
			Local s:String = "---"
			Return s
		End
		Function GetBrowserName:String()
			Local s:String = "---"
			Return s
		End
		Function GetBrowserVersion:String()
			Local s:String = "---"
			Return s
		End
		Function GetBrowserPlatform:String()
			Local s:String = "---"
			Return s
		End
		Function MaximizeCanvas:Void()
			'
		End
	#End

'------------------------------------------
#Rem
'summery:Calculates the pitchrate for the amount of given halfsteps. 
The default base note is 'A4'
#End

Function GetPitchRate:Float(halfStep:Float, base:Float=1.0)
	'Pow(2.0,1.0/12.0) = 1.0594630943592953
	Local pr:Float = Pow(1.0594630943592953,halfStep) * base
	Return pr
End	
	

#rem
footer:This fantomEngine framework is released under the MIT license:
[quote]Copyright (c) 2011-2013 Michael Hartlef

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, and to permit persons to whom the software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
[/quote]
#end	