#!/bin/bash
trap 'echo interrupted; [ -d ${PATH_VERSION} ] && rm -Rf ${PATH_VERSION}; exit' INT

ROOTPATH="./packages"
LIST_PACKAGES=(
	jquery
	angular
)

if [ ! -d "${ROOTPATH}" ]; then
	mkdir -p ${ROOTPATH}
fi
rm -Rf .bowerrc

for PACKAGE in ${LIST_PACKAGES[@]}; do
	echo "Processing ${PACKAGE}:"

	PATH_PACKAGE="${ROOTPATH}/${PACKAGE}"
	if [ ! -d "${PATH_PACKAGE}" ]; then
		mkdir ${PATH_PACKAGE}
		echo "  - [${PACKAGE}] Creating directory"
	fi

	echo "  - [${PACKAGE}] Getting list of versions"
	LIST_VERSIONS=$(bower info ${PACKAGE} | egrep '^  - [0-9]+.[0-9]+.[0-9]+$' | awk -F ' ' '{print $2}')
	echo "  - [${PACKAGE}] Fetching versions:"
	for VERSION in ${LIST_VERSIONS[@]}; do
		PATH_VERSION="${PATH_PACKAGE}/${VERSION}"
		if [ -d "${PATH_VERSION}/" ]; then
			COUNT_FILES_IN_VERSION=$(ls -a1 ${PATH_VERSION} | egrep -v "^\.{1,2}$" | wc -l)
			if [ ${COUNT_FILES_IN_VERSION} -gt 0 ]; then
				echo "    - [${VERSION}] Skipped"
				continue
			fi
		fi


		if [ ! -d "${PATH_VERSION}" ]; then
			mkdir ${PATH_VERSION}
			echo "    - [${VERSION}] Create directory"
		fi
		echo "    - [${VERSION}] Pull version"
		echo "{" > .bowerrc
		echo "  \"directory\":\"${PATH_VERSION}\"" >> .bowerrc
		echo "}" >> .bowerrc

		bower install ${PACKAGE}#${VERSION} > /dev/null 2>&1
		if [ -d "${PATH_VERSION}/${PACKAGE}/dist" ]; then
			mv ${PATH_VERSION}/${PACKAGE}/dist/* ${PATH_VERSION}/
		elif [ -e "${PATH_VERSION}/${PACKAGE}/${PACKAGE}.js" ]; then
			mv ${PATH_VERSION}/${PACKAGE}/${PACKAGE}.js ${PATH_VERSION}/
			if [ -e "${PATH_VERSION}/${PACKAGE}/${PACKAGE}.min.js" ]; then
				mv ${PATH_VERSION}/${PACKAGE}/${PACKAGE}.min.js ${PATH_VERSION}/
			fi
			if [ -e "${PATH_VERSION}/${PACKAGE}/${PACKAGE}.map" ]; then
				mv ${PATH_VERSION}/${PACKAGE}/${PACKAGE}.map ${PATH_VERSION}/
			fi
		else
			COUNT_SUBDIRECTORIES_VERSION=$(find ${PATH_VERSION}/* -maxdepth 1 -type d | wc -l)
			if [ ${COUNT_SUBDIRECTORIES_VERSION} -gt 0 ]; then
				touch ${PATH_VERSION}/.blockfolder
			else
				mv ${PATH_VERSION}/${PACKAGE}/* ${PATH_VERSION}/
			fi
		fi

		rm -Rf ${PATH_VERSION}/${PACKAGE}/
	done
done

rm -Rf .bowerrc