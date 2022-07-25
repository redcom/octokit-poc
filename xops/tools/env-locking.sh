#!/bin/bash

BOLD='\033[1;37m'
INVERT='\033[0;92m'
BLUE='\033[1;94m'
YELLOW='\033[1;93m'
RED='\033[0;31m'
RESET='\033[0m'

echo -e "\n${INVERT}Is GPG installed?${RESET}"
if ! command -v gpg &> /dev/null
then
  if [[ $OSTYPE == 'darwin'* ]]; then
    brew install gpg
  else
    apt-get install gnupg
  fi
fi

echo -e "$INVERT"
echo "    `gpg --version | head -1` "
echo -e "$RESET"

[ -z $1 ] &&  echo -e "${BLUE}Use -d file to decrypt or -e file to encrypt${RESET}" && exit 1


ENCRYPT="false"
DECRYPT="false"
for i in "$@"
do
  case $i in
    -e)
    ENCRYPT="true"
    shift
    ;;
    -d)
    DECRYPT="true"
    shift
    ;;
  esac
done



function encrypt {
  gpg -i -o "$1.gpg" --pinentry-mode loopback --passphrase  $GPG_KEY --symmetric $1
  echo -e "\n 🔥 $1.gpg file $BLUE encrypted $RESET"
}
function decrypt {
  new_filename="${1%.*}"
  echo $new_filename
  echo $GPG_KEY | gpg -i -d --passphrase-fd 0  --batch --yes $1 > $new_filename
  echo -e "\n 🔥 $1 file $BLUE decrypted $RESET"
}


FILE_NAME=$1
if [ "$ENCRYPT" == "true" ]; then
  echo -e "ENCRYPTING $BOLD$YELLOW '$FILE_NAME' $RESET\n"
  [ ! -r $FILE_NAME ] && echo -e "$BOLD$RED \t😂 '$FILE_NAME' does not exists" && exit 1
  [ -z "$GPG_KEY" ] && echo -e "$BOLD$RED \t🔑 '\$GPG_KEY' environment does not exists" && exit 1

  encrypt $FILE_NAME

fi

if [ "$DECRYPT" == "true" ]; then
  echo -e "DECRYPTING $BOLD$YELLOW '$FILE_NAME' $RESET\n"
  [ ! -s $FILE_NAME ] && echo -e "$BOLD$RED \t😂 $FILE_NAME' does not exists" && exit 1
  [ -z $GPG_KEY ] && echo -e "$BOLD$RED \t🔑 '$FILE_NAME' does not exists" && exit 1

  decrypt $FILE_NAME

fi

