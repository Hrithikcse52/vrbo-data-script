const axios = require("axios");
const fs = require("fs");
const { stringify } = require("csv");
const { addDays, differenceInCalendarDays } = require("date-fns");
const argv = require("yargs/yargs")(process.argv.slice(2)).argv;

async function main() {
  const { q, page } = argv;
  if (q && page) {
    const data = JSON.stringify({
      operationName: "SearchRequestQuery",
      variables: {
        filterCounts: true,
        request: {
          paging: {
            page: 1,
            pageSize: page,
          },
          filterVersion: "1",
          coreFilters: {
            adults: 1,
            maxBathrooms: null,
            maxBedrooms: null,
            maxNightlyPrice: null,
            maxTotalPrice: null,
            minBathrooms: 0,
            minBedrooms: 0,
            minNightlyPrice: 0,
            minTotalPrice: null,
            pets: 0,
          },
          filters: [],
          q,
        },
        optimizedBreadcrumb: false,
        vrbo_web_global_messaging_banner: true,
      },
      extensions: {
        isPageLoadSearch: true,
      },
      query:
        'query SearchRequestQuery($request: SearchResultRequest!, $filterCounts: Boolean!, $optimizedBreadcrumb: Boolean!, $vrbo_web_global_messaging_banner: Boolean!) {  results: search(request: $request) {    ...querySelectionSet    ...DestinationBreadcrumbsSearchResult    ...DestinationMessageSearchResult    ...FilterCountsSearchRequestResult    ...HitCollectionSearchResult    ...ADLSearchResult    ...MapSearchResult    ...ExpandedGroupsSearchResult    ...PagerSearchResult    ...SearchTermCarouselSearchResult    ...InternalToolsSearchResult    ...SEOMetaDataParamsSearchResult    ...GlobalInlineMessageSearchResult    ...GlobalBannerContainerSearchResult @include(if: $vrbo_web_global_messaging_banner)    __typename  }}fragment querySelectionSet on SearchResult {  id  typeaheadSuggestion {    uuid    term    name    __typename  }  geography {    lbsId    gaiaId    location {      latitude      longitude      __typename    }    isGeocoded    shouldShowMapCentralPin    __typename  }  propertyRedirectUrl  __typename}fragment DestinationBreadcrumbsSearchResult on SearchResult {  destination(optimizedBreadcrumb: $optimizedBreadcrumb) {    breadcrumbs {      name      url      __typename    }    __typename  }  __typename}fragment HitCollectionSearchResult on SearchResult {  page  pageSize  pageCount  queryUUID  percentBooked {    currentPercentBooked    __typename  }  listings {    ...HitListing    __typename  }  resultCount  pinnedListing {    headline    listing {      ...HitListing      __typename    }    __typename  }  __typename}fragment HitListing on Listing {  virtualTourBadge {    name    id    helpText    __typename  }  amenitiesBadges {    name    id    helpText    __typename  }  images {    altText    c6_uri    c9_uri    mab {      banditId      payloadId      campaignId      cached      arm {        level        imageUrl        categoryName        __typename      }      __typename    }    __typename  }  ...HitInfoListing  __typename}fragment HitInfoListing on Listing {  listingId  ...HitInfoDesktopListing  ...HitInfoMobileListing  ...PriceListing  __typename}fragment HitInfoDesktopListing on Listing {  detailPageUrl unitApiUrl  instantBookable  minStayRange {    minStayHigh    minStayLow    __typename  }  listingId  listingNumber  rankedBadges(rankingStrategy: SERP) {    id    helpText    name    __typename  }  propertyId  propertyMetadata {    headline    __typename  }  superlativesBadges: rankedBadges(rankingStrategy: SERP_SUPERLATIVES) {    id    helpText    name    __typename  }  unitMetadata {    unitName    __typename  }  webRatingBadges: rankedBadges(rankingStrategy: SRP_WEB_RATING) {    id    helpText    name    __typename  }  ...DetailsListing  ...GeoDistanceListing  ...RateSummary ...PriceListing  ...RatingListing  __typename}fragment DetailsListing on Listing {  bathrooms {    full    half    toiletOnly    __typename  }  bedrooms  propertyType  sleeps  petsAllowed  spaces {    spacesSummary {      area {        areaValue        __typename      }      bedCountDisplay      __typename    }    __typename  }  __typename}fragment GeoDistanceListing on Listing {  geoDistance {    text    relationType    __typename  }  __typename}  fragment RateSummary on Listing { rateSummary { beginDate  endDate rentNights } } fragment PriceListing on Listing {  priceSummary: priceSummary {  priceAccurate    ...PriceSummaryTravelerPriceSummary    __typename  }  priceSummarySecondary: priceSummary(summary: "displayPriceSecondary") {    ...PriceSummaryTravelerPriceSummary    __typename  }  priceLabel: priceSummary(summary: "priceLabel") {    priceTypeId    pricePeriodDescription    __typename  }  prices {    ...VrboTravelerPriceSummary    __typename  }  __typename}fragment PriceSummaryTravelerPriceSummary on TravelerPriceSummary {  priceTypeId  edapEventJson  formattedAmount  roundedFormattedAmount  pricePeriodDescription  __typename}fragment VrboTravelerPriceSummary on PriceSummary {  perNight {    amount    formattedAmount    roundedFormattedAmount    pricePeriodDescription    __typename  }  total {    amount    formattedAmount    roundedFormattedAmount    pricePeriodDescription    __typename  }  label  mainPrice  __typename}fragment RatingListing on Listing {  averageRating  reviewCount  __typename}fragment HitInfoMobileListing on Listing {  detailPageUrl  instantBookable  minStayRange {    minStayHigh    minStayLow    __typename  }  listingId  listingNumber  rankedBadges(rankingStrategy: SERP) {    id    helpText    name    __typename  }  propertyId  propertyMetadata {    headline    __typename  }  superlativesBadges: rankedBadges(rankingStrategy: SERP_SUPERLATIVES) {    id    helpText    name    __typename  }  unitMetadata {    unitName    __typename  }  webRatingBadges: rankedBadges(rankingStrategy: SRP_WEB_RATING) {    id    helpText    name    __typename  }  ...DetailsListing  ...GeoDistanceListing ...RateSummary ...PriceListing  ...RatingListing  __typename}fragment ExpandedGroupsSearchResult on SearchResult {  expandedGroups {    ...ExpandedGroupExpandedGroup    __typename  }  __typename}fragment ExpandedGroupExpandedGroup on ExpandedGroup {  listings {    ...HitListing    ...MapHitListing    __typename  }  mapViewport {    neLat    neLong    swLat    swLong    __typename  }  __typename}fragment MapHitListing on Listing {  ...HitListing  geoCode {    latitude    longitude    __typename  }  __typename}fragment FilterCountsSearchRequestResult on SearchResult {  id  resultCount  filterGroups {    groupInfo {      name      id      __typename    }    filters {      count @include(if: $filterCounts)      checked      filter {        id        name        refineByQueryArgument        description        __typename      }      __typename    }    __typename  }  __typename}fragment MapSearchResult on SearchResult {  mapViewport {    neLat    neLong    swLat    swLong    __typename  }  page  pageSize  listings {    ...MapHitListing    __typename  }  pinnedListing {    listing {      ...MapHitListing      __typename    }    __typename  }  __typename}fragment PagerSearchResult on SearchResult {  fromRecord  toRecord  pageSize  pageCount  page  resultCount  __typename}fragment DestinationMessageSearchResult on SearchResult {  destinationMessage(assetVersion: 4) {    iconTitleText {      title      message      icon      messageValueType      link {        linkText        linkHref        __typename      }      __typename    }    ...DestinationMessageDestinationMessage    __typename  }  __typename}fragment DestinationMessageDestinationMessage on DestinationMessage {  iconText {    message    icon    messageValueType    __typename  }  __typename}fragment ADLSearchResult on SearchResult {  parsedParams {    q    coreFilters {      adults      children      pets      minBedrooms      maxBedrooms      minBathrooms      maxBathrooms      minNightlyPrice      maxNightlyPrice      minSleeps      __typename    }    dates {      arrivalDate      departureDate      __typename    }    sort    __typename  }  page  pageSize  pageCount  resultCount  fromRecord  toRecord  pinnedListing {    listing {      listingId      __typename    }    __typename  }  listings {    listingId    __typename  }  filterGroups {    filters {      checked      filter {        groupId        id        __typename      }      __typename    }    __typename  }  geography {    lbsId    name    description    location {      latitude      longitude      __typename    }    primaryGeoType    breadcrumbs {      name      countryCode      location {        latitude        longitude        __typename      }      primaryGeoType      __typename    }    __typename  }  __typename}fragment SearchTermCarouselSearchResult on SearchResult {  discoveryXploreFeeds {    results {      id      title      items {        ... on SearchDiscoveryFeedItem {          type          imageHref          place {            uuid            name {              full              simple              __typename            }            __typename          }          __typename        }        __typename      }      __typename    }    __typename  }  typeaheadSuggestion {    name    __typename  }  __typename}fragment InternalToolsSearchResult on SearchResult {  internalTools {    searchServiceUrl    __typename  }  __typename}fragment SEOMetaDataParamsSearchResult on SearchResult {  page  resultCount  pageSize  geography {    name    lbsId    breadcrumbs {      name      __typename    }    __typename  }  __typename}fragment GlobalInlineMessageSearchResult on SearchResult {  globalMessages {    ...GlobalInlineAlertGlobalMessages    __typename  }  __typename}fragment GlobalInlineAlertGlobalMessages on GlobalMessages {  alert {    action {      link {        href        text {          value          __typename        }        __typename      }      __typename    }    body {      text {        value        __typename      }      link {        href        text {          value          __typename        }        __typename      }      __typename    }    id    severity    title {      value      __typename    }    __typename  }  __typename}fragment GlobalBannerContainerSearchResult on SearchResult {  globalMessages {    ...GlobalBannerGlobalMessages    __typename  }  __typename}fragment GlobalBannerGlobalMessages on GlobalMessages {  banner {    body {      text {        value        __typename      }      link {        href        text {          value          __typename        }        __typename      }      __typename    }    id    severity    title {      value      __typename    }    __typename  }  __typename}',
    });
    const config = {
      method: "post",
      url: "https://www.vrbo.com/serp/g",
      headers: {
        "Content-Type": "application/json",
        Cookie:
          "DUAID=19507e7d-26ba-bec2-5c6d-f773a87f554a; HMS=387d78e0-33d6-4fc2-bdcf-48644c340761; MC1=GUID=19507e7d26babec25c6df773a87f554a; ak_bmsc=1B7D15B1856C9D1426A4876BAE1DE39D~000000000000000000000000000000~YAAQRbcsMUc7VSKCAQAAgVZzSRBstDRuDBjWlzkPT63yUrvOQBs2OD3gMya7yMy9+tVzLCGpyso1aZ4b9x2Qk0oIt30S6Pn6lX56l6XZY68ZAY7l465rXOPNDjB/ZHdI97cPJ3dI1ERxPrM0DhLy/5WM9Bfd8jgYMAn9WBx9YhbWe0NRdZ0sQPlWFVq1YEa0OPbR7oN1FZCbXCsqrgEcVqSXVOaAqJUz31cFyw377NR1dBoMPl8rW7+QtzLDkp04ch02jIKIzzZoUejkTnWNGb3qyHCXzq0cSYzR9L8iJ/8PLVuXoRA9YvNjnriMdRrAjQQEhjkbEL0r+EqQ5TD7Un/JV21vICz3epOUqz5WkA6zc+N7+0MkV4Y=; cba2f1a1-1348-c304-da10-89ac813a3693SL=1; eu-site=0; ha-device-id=19507e7d-26ba-bec2-5c6d-f773a87f554a; hal=ga=1&ua=1&si=1&ui=1&vi=1&pr=0; has=cba2f1a1-1348-c304-da10-89ac813a3693; hav=19507e7d-26ba-bec2-5c6d-f773a87f554a",
      },
      data: data,
    };
    console.log(q, page);
    const { data: response } = await axios(config);

    if (
      response &&
      response.data &&
      response.data.results &&
      response.data.results.listings
    ) {
      const header = [
        "id",
        "listingId",
        "name",
        new Date().toLocaleDateString("en-CA"),
      ];
      const csvdata = [];
      const listings = response.data.results.listings;
      listings.forEach((listing) => {
        const diff = differenceInCalendarDays(
          new Date(),
          new Date(listing.rateSummary.beginDate)
        );

        let ratelist = listing.rateSummary.rentNights;
        let beginDate = listing.rateSummary.beginDate;
        if (diff > 0) {
          if (listing.rateSummary.rentNights)
            ratelist = listing.rateSummary.rentNights.slice(diff);
          beginDate = new Date().toLocaleDateString("en-CA");
        }
        const list = [];
        list.push(listing.listingId);
        list.push(listing.listingNumber);
        list.push(listing.propertyMetadata.headline);
        if (ratelist) {
          ratelist.forEach((rate) => {
            list.push(rate);
            if (list.length > header.length) {
              console.log("header", list.length - header.length, header);
              header.push(
                addDays(
                  new Date(header[header.length - 1]),
                  1
                ).toLocaleDateString("en-CA")
              );
            }
          });
        }
        csvdata.push(list);

        // return {
        //   listingId: listing.listingId,
        //   listingNumber: listing.listingNumber,
        //   name: listing.propertyMetadata.headline,
        //   rate: {
        //     beginDate,
        //     endDate: listing.rateSummary.endDate,
        //     rentNights: ratelist,
        //   },
        // };
      });
      console.log("header", header);
      //   csvdata.unshift(header);
      console.log("csvdata", csvdata);
      const writableStream = fs.createWriteStream("test.csv");
      const stringifier = stringify({ header: true, columns: header });
      csvdata.forEach((csv) => {
        stringifier.write(csv);
      });
      stringifier.pipe(writableStream);
      console.log("file created");
    }
  } else {
    console.log("something is missing !");
  }
}

main();
