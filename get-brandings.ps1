param([Parameter(Mandatory = $True)]$environment)

$startDir = pwd


gci $environment |foreach {
	cd $_.Fullname 
	$brandingName = $_.Name
	if (Test-Path -PathType Container -Path "variableSets") {
		gci "variableSets" | foreach { "$brandingName." + $_.Name }
	}
	$brandingName
}

cd $startDir
