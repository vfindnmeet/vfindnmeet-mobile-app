import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { STORAGE_LANG_KEY } from "../constants";
import { getLang, getStorageItem } from "../utils";

export default function useLanguage() {
  const { i18n } = useTranslation();

  useEffect(() => {
    getStorageItem(STORAGE_LANG_KEY)
      .then(lang => {
        i18n.changeLanguage(getLang(lang));
      });
  }, []);
}
