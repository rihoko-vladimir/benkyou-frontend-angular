import { SetResponse } from '../../Models/Responses/SetResponse';
import Set from '../../Models/Set';
import Kanji from '../../Models/Kanji';
import { KanjiResponse } from '../../Models/Responses/KanjiResponse';
import { SetRequest } from '../../Models/Requests/SetRequest';
import { KanjiRequest } from '../../Models/Requests/KanjiRequest';
import { PagedSetsResponse } from '../../Models/Responses/PagedSetsResponse';
import { IPagedSets } from '../Interfaces/paged-sets';
import { UserResponse } from '../../Models/Responses/UserResponse';
import { IAccountState } from '../../Redux/Reducers/account.reducer';

export const mapSetResponseToSet = (setResponse: SetResponse) =>
  new Set(
    setResponse.id,
    setResponse.name,
    setResponse.description,
    '',
    setResponse.authorId,
    setResponse.kanjiList.map(mapKanjiResponseToKanji)
  );

export const mapKanjiResponseToKanji = (kanjiResponse: KanjiResponse) =>
  new Kanji(
    kanjiResponse.kanjiChar,
    kanjiResponse.kunyomiReadings.map(kunyomiResponse => kunyomiResponse.reading),
    kanjiResponse.onyomiReadings.map(onyomiResponse => onyomiResponse.reading)
  );

export const mapSetToSetRequest = (set: Set): SetRequest => ({
  name: set.name,
  description: set.description,
  kanjiList: set.kanjiList.map(mapKanjiToKanjiRequest)
});

export const mapKanjiToKanjiRequest = (kanji: Kanji): KanjiRequest => ({
  kanjiChar: kanji.kanji,
  kunyomiReadings: kanji.kunyomi.map(reading => ({
    reading: reading
  })),
  onyomiReadings: kanji.onyomi.map(reading => ({
    reading: reading
  }))
});

export const mapPagedSetsResponseToPagedSets = (pagedResponse: PagedSetsResponse): IPagedSets => ({
  sets: pagedResponse.sets.map(mapSetResponseToSet),
  pagesCount: pagedResponse.pagesCount,
  currentPage: pagedResponse.currentPage
});

export const mapUserResponseToAccountState = (userInfo: UserResponse): IAccountState => ({
  id: userInfo.id,
  firstName: userInfo.firstName,
  lastName: userInfo.lastName,
  userName: userInfo.userName,
  userRole: userInfo.userRole,
  isTermsAccepted: userInfo.isTermsAccepted,
  isAccountPublic: userInfo.isAccountPublic,
  birthDay: userInfo.birthDay,
  about: userInfo.about,
  avatarUrl: userInfo.avatarUrl,
  error: { isError: false, errorMessage: '' }
});
