export type TunisiaGovernorate = {
  name: string;
  code: string;
  delegations: string[];
};

export const TUNISIA_GOVERNORATES: TunisiaGovernorate[] = [
  { name: 'Ariana', code: 'TN-12', delegations: ['Ariana Ville', 'Cite Ettadhamen', 'Kalaat El Andalous', 'La Soukra', 'Mnihla', 'Raoued', 'Sidi Thabet'] },
  { name: 'Beja', code: 'TN-31', delegations: ['Amdoun', 'Beja Nord', 'Beja Sud', 'Goubellat', 'Medjez El Bab', 'Nefza', 'Teboursouk', 'Testour', 'Thibar'] },
  { name: 'Ben Arous', code: 'TN-13', delegations: ['Ben Arous', 'Bou Mhel El Bassatine', 'El Mourouj', 'Ezzahra', 'Fouchana', 'Hammam Chott', 'Hammam Lif', 'Medina Jedida', 'Megrine', 'Mohamedia', 'Mornag', 'Rades'] },
  { name: 'Bizerte', code: 'TN-23', delegations: ['Bizerte Nord', 'Bizerte Sud', 'El Alia', 'Ghar El Melh', 'Ghezala', 'Joumine', 'Mateur', 'Menzel Bourguiba', 'Menzel Jemil', 'Ras Jebel', 'Sejnane', 'Tinja', 'Utique', 'Zarzouna'] },
  { name: 'Gabes', code: 'TN-81', delegations: ['Dkhilet Toujane', 'El Hamma', 'Gabes Medina', 'Gabes Ouest', 'Gabes Sud', 'Ghannouch', 'Habib Thameur Bouatouch', 'Mareth', 'Matmata', 'Menzel El Habib', 'Metouia', 'Nouvelle Matmata', 'Oudhref'] },
  { name: 'Gafsa', code: 'TN-71', delegations: ['Belkhir', 'El Guettar', 'El Ksar', 'Gafsa Nord', 'Gafsa Sud', 'Mdhila', 'Metlaoui', 'Moulares', 'Redeyef', 'Sened', 'Sidi Aich', 'Sidi Boubaker', 'Zannouch'] },
  { name: 'Jendouba', code: 'TN-32', delegations: ['Ain Draham', 'Balta Bou Aouane', 'Bou Salem', 'Fernana', 'Ghardimaou', 'Jendouba', 'Jendouba Nord', 'Oued Meliz', 'Tabarka'] },
  { name: 'Kairouan', code: 'TN-41', delegations: ['Ain Djeloula', 'Bou Hajla', 'Chebika', 'Echrarda', 'El Alaa', 'Haffouz', 'Hajeb El Ayoun', 'Kairouan Nord', 'Kairouan Sud', 'Menzel Mehiri', 'Nasrallah', 'Oueslatia', 'Sbikha'] },
  { name: 'Kasserine', code: 'TN-42', delegations: ['El Ayoun', 'Ezzouhour', 'Feriana', 'Foussana', 'Haidra', 'Hassi El Ferid', 'Jedelienne', 'Kasserine Nord', 'Kasserine Sud', 'Majel Bel Abbes', 'Sbeitla', 'Sbiba', 'Thala'] },
  { name: 'Kebili', code: 'TN-73', delegations: ['Douz Nord', 'Douz Sud', 'Faouar', 'Kebili Nord', 'Kebili Sud', 'Rjim Maatoug', 'Souk Lahad'] },
  { name: 'Kef', code: 'TN-33', delegations: ['Dahmani', 'El Ksour', 'Jerissa', 'Kalaat Khasba', 'Kalaat Senan', 'Kef Est', 'Kef Ouest', 'Nebeur', 'Sakiet Sidi Youssef', 'Sers', 'Tajerouine', 'Touiref'] },
  { name: 'Mahdia', code: 'TN-53', delegations: ['Bou Merdes', 'Chebba', 'Chorbane', 'El Bradaa', 'El Jem', 'Essouassi', 'Hebira', 'Ksour Essef', 'Mahdia', 'Mellouleche', 'Ouled Chamekh', 'Rejiche', 'Sidi Alouane'] },
  { name: 'Manouba', code: 'TN-14', delegations: ['Borj El Amri', 'Djedeida', 'Douar Hicher', 'El Batan', 'Manouba', 'Mornaguia', 'Oued Ellil', 'Tebourba'] },
  { name: 'Medenine', code: 'TN-82', delegations: ['Ben Gardane', 'Beni Khedache', 'Djerba Ajim', 'Djerba Houmt Souk', 'Djerba Midoun', 'Medenine Nord', 'Medenine Sud', 'Sidi Makhlouf', 'Zarzis'] },
  { name: 'Monastir', code: 'TN-52', delegations: ['Bekalta', 'Bembla', 'Beni Hassen', 'Jemmal', 'Ksar Hellal', 'Ksibet El Mediouni', 'Moknine', 'Monastir', 'Ouerdanine', 'Sahline', 'Sayada Lamta Bouhjar', 'Teboulba', 'Zeramdine'] },
  { name: 'Nabeul', code: 'TN-21', delegations: ['Beni Khalled', 'Beni Khiar', 'Bou Argoub', 'Dar Chaabane El Fehri', 'El Haouaria', 'El Mida', 'Grombalia', 'Hammamet', 'Hammam Ghezaz', 'Kelibia', 'Korba', 'Menzel Bouzelfa', 'Menzel Temime', 'Nabeul', 'Soliman', 'Takelsa'] },
  { name: 'Sfax', code: 'TN-61', delegations: ['Agareb', 'Bir Ali Ben Khalifa', 'El Amra', 'El Hencha', 'Graiba', 'Jebiniana', 'Kerkennah', 'Mahres', 'Menzel Chaker', 'Sakiet Eddaier', 'Sakiet Ezzit', 'Sfax Ouest', 'Sfax Sud', 'Sfax Ville', 'Skhira', 'Thyna'] },
  { name: 'Sidi Bouzid', code: 'TN-43', delegations: ['Bir El Hafey', 'Cebbala Ouled Asker', 'El Hichria', 'Essaida', 'Jilma', 'Meknassy', 'Menzel Bouzaiane', 'Mezzouna', 'Ouled Haffouz', 'Regueb', 'Sidi Ali Ben Aoun', 'Sidi Bouzid Est', 'Sidi Bouzid Ouest', 'Souk Jedid'] },
  { name: 'Siliana', code: 'TN-34', delegations: ['Bargou', 'Bou Arada', 'El Aroussa', 'El Krib', 'Gaafour', 'Kesra', 'Makthar', 'Rouhia', 'Sidi Bou Rouis', 'Siliana Nord', 'Siliana Sud'] },
  { name: 'Sousse', code: 'TN-51', delegations: ['Akouda', 'Bouficha', 'Enfida', 'Hammam Sousse', 'Hergla', 'Kalaa Kebira', 'Kalaa Seghira', 'Kondar', 'Msaken', 'Sidi Bou Ali', 'Sidi El Hani', 'Sousse Jawhara', 'Sousse Medina', 'Sousse Riadh', 'Sousse Sidi Abdelhamid', 'Zaouiet Ksibet Thrayet'] },
  { name: 'Tataouine', code: 'TN-83', delegations: ['Beni Mehira', 'Bir Lahmar', 'Dehiba', 'Ghomrassen', 'Remada', 'Smar', 'Tataouine Nord', 'Tataouine Sud'] },
  { name: 'Tozeur', code: 'TN-72', delegations: ['Degache', 'El Hamma du Jerid', 'Hazoua', 'Nefta', 'Tamerza', 'Tozeur'] },
  { name: 'Tunis', code: 'TN-11', delegations: ['Bab El Bhar', 'Bab Souika', 'Carthage', 'Cite El Khadra', 'Djebel Jelloud', 'El Hrairia', 'El Kabaria', 'El Menzah', 'El Omrane', 'El Omrane Superieur', 'El Ouardia', 'Ettahrir', 'Ezzouhour', 'La Goulette', 'La Marsa', 'Le Bardo', 'Le Kram', 'Medina', 'Sejoumi', 'Sidi El Bechir', 'Sidi Hassine'] },
  { name: 'Zaghouan', code: 'TN-22', delegations: ['Bir Mcherga', 'El Fahs', 'Nadhour', 'Saouaf', 'Zaghouan', 'Zriba'] }
];

export function getGovernorateDelegations(governorateName: string): string[] {
  return TUNISIA_GOVERNORATES.find(gov => gov.name === governorateName)?.delegations ?? [];
}
