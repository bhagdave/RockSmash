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
'header:The module cftHighScore adds an easy to manage local highscore list to your game.


Import fantomEngine
'#DOCOFF#
'***************************************
Class ftHighScoreEntry
	Field name:String
	Field value:Int
End
'#DOCON#
'***************************************
'summery:The class ftHighScoreList offers a complete set of methods for storing and retrieving high-score list entries.
Class ftHighScoreList
'#DOCOFF#
	Field entryList := New List<ftHighScoreEntry>
	Field entryCount:Int = 10
'#DOCON#
	'------------------------------------------
'summery:Add a new entry to the list.
	Method AddScore:Int(value:Int, n:String="")
		Local ret:Int = 0
		Local c:Int = 0
		c += 1
		For Local entry := Eachin entryList
			If value >= entry.value Then
				Exit
			Else
				c += 1
			Endif
		Next
		'New Score entry
		If c<= entryCount Then
			If entryList.Count()=entryCount Then entryList.RemoveLast()
			Local tempScore := New ftHighScoreEntry
			tempScore.value = value
			tempScore.name = n
			entryList.AddLast(tempScore)
			ret = c
			If entryList.Count()>1 Then SortList()
		Endif
		Return ret
	End	
	'------------------------------------------
'summery:Clears the complete high-score list.
	Method Clear:Void()
		entryList.Clear()
		'Return 0
	End	
	'------------------------------------------
'summery:Get the numbers of entries.
	Method Count:Int()
		Return entryList.Count()
	End	
	'------------------------------------------
'summery:Get the name of an entry.
	Method GetName:String(i:Int)
		Local c:Int
		For Local entry := Eachin entryList
			c += 1
			If c = 1 Then Return entry.name
		Next
		Return "---"
	End	
	'------------------------------------------
'summery:Get the value of an entry.
	Method GetValue:Int(i:Int)
		Local c:Int
		For Local entry := Eachin entryList
			c += 1
			If c = i Then Return Int(entry.value)
		Next
		Return 0
	End	
	'------------------------------------------
'summery:Load a high-score list from a string.
	Method LoadFromString:Void(hs:String)
		entryList.Clear()
		Local lines := hs.Split(String.FromChar(10))
		For Local line:= Eachin lines
			If line = "" Then Continue
			If line.StartsWith("count=") Then
				Local ct$[] = line.Split("=")
				entryCount = Int(ct[1])
			Else 
				Local dt$[] = line.Split("=")
				Local tempEntry:ftHighScoreEntry = New ftHighScoreEntry 
				tempEntry.value = Int(dt[0])
				tempEntry.name = dt[1]
				entryList.AddLast(tempEntry)
			Endif
		Next
		'Return 0
	End	
	'------------------------------------------
'summery:Save the high-score list to a string.
	Method SaveToString:String()
		Local hs:String
		hs = "count="+entryCount+String.FromChar(10)
		For Local entry := Eachin entryList
			hs = hs + entry.value+"="+entry.name+String.FromChar(10)
		Next
		Return hs
	End
'#DOCOFF#	
	'------------------------------------------
	Method SortList:Void()
		Local tempList:ftHighScoreEntry[64]
		Local tempEntry:ftHighScoreEntry = New ftHighScoreEntry 
		Local c:Int = 0
		Local hasSort:Bool
		'Create the templist as an array
		For Local z:Int = 1 To entryCount
			tempList[z-1] = New ftHighScoreEntry
		Next
		For Local entry := Eachin entryList
			c += 1
			tempList[c-1].value = entry.value
			tempList[c-1].name = entry.name				
		Next
		'Sort the templist array
		Repeat
			hasSort = False
			For Local i:Int = 2 To c
				If tempList[i-1].value > tempList[i-2].value Then
					tempEntry.value = tempList[i-2].value
					tempEntry.name = tempList[i-2].name
					tempList[i-2].value = tempList[i-1].value
					tempList[i-2].name = tempList[i-1].name
					tempList[i-1].value = tempEntry.value
					tempList[i-1].name = tempEntry.name
					hasSort = True
				Endif 
			Next
		Until hasSort=False
		'Write the templist array back into the list
		c = 0
		For Local entry := Eachin entryList
			entry.value = tempList[c].value
			entry.name = tempList[c].name				
			c += 1
		Next
		'Return 0
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