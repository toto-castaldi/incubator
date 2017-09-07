flash-cards
=========

# Specification

## 1.0

a flash card must be composed ad least from two files: the **info** file and one or more **body** files

### Info

#### Name

[flash card name separated by dashes].yaml

#### Content

if a tag is bold, it's required

**version**:1.0
**tags**:[tags separated by commas]
title:[the title of the flash card]
language:[supported language separated by commas]


### Body file formats

#### .body file

is a custom file format
if a line starts with a **#** it contains a comment
if a line starts with a **>** it contains a command for a computer
if a line starts with a **$** it contains an operation for a computer

#### .md file





#### Greetings

> Written with [StackEdit](https://stackedit.io/).
