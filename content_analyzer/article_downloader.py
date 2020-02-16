from newspaper import Article as nArticle

import copy
from newspaper.cleaners import DocumentCleaner
from newspaper.outputformatters import OutputFormatter
from newspaper.videos.extractors import VideoExtractor


class Cleaner(DocumentCleaner):
    """
    Extended DocumentCleaner, to skip removing "naughty" dom tags
    """

    def clean(self, doc_to_clean):
        """Remove chunks of the DOM as specified
        """
        doc_to_clean = self.clean_body_classes(doc_to_clean)
        doc_to_clean = self.clean_article_tags(doc_to_clean)
        doc_to_clean = self.clean_em_tags(doc_to_clean)
        doc_to_clean = self.remove_drop_caps(doc_to_clean)
        doc_to_clean = self.remove_scripts_styles(doc_to_clean)

        # Skipped this cleaning step
        # doc_to_clean = self.clean_bad_tags(doc_to_clean)

        doc_to_clean = self.remove_nodes_regex(doc_to_clean, self.caption_re)
        doc_to_clean = self.remove_nodes_regex(doc_to_clean, self.google_re)
        doc_to_clean = self.remove_nodes_regex(doc_to_clean, self.entries_re)
        doc_to_clean = self.remove_nodes_regex(doc_to_clean, self.facebook_re)
        doc_to_clean = self.remove_nodes_regex(doc_to_clean,
                                               self.facebook_braodcasting_re)
        doc_to_clean = self.remove_nodes_regex(doc_to_clean, self.twitter_re)
        doc_to_clean = self.clean_para_spans(doc_to_clean)
        doc_to_clean = self.div_to_para(doc_to_clean, 'div')
        doc_to_clean = self.div_to_para(doc_to_clean, 'span')
        doc_to_clean = self.div_to_para(doc_to_clean, 'section')
        return doc_to_clean


class Article(nArticle):
    """
    Extend the Original newspaper3k Article class
    Had to extend the original class to add an option to use a modified document cleaner
    Some spcial sources need to skip: doc_to_clean = self.clean_bad_tags(doc_to_clean)
    so they keep more text

    This allows it to parse article the same as SMMRY.COM OR https://lateral.io/docs/article-extractor
    Test URL: http://www.physiciansnewsnetwork.com/ximed/study-hospital-physician-vertical-integration-has-little-impact-on-quality/article_257c41a0-3a11-11e9-952b-97cc981efd76.html

    # TODO: Still does not work with some blogger.com themes
    """

    def parse(self, clean_doc=True):
        """
        Extend the Original newspaper3k Article parser
        :param clean_doc:
            Controls wether to use original DocmeuntClenaer or modified

            Original cleaner:
            On some sources this prevents the text from being parsed (Special occasion, don't parse)
            However should almost always be used otherwsie bad elements might slip through
        :return:
        """

        self.throw_if_not_downloaded_verbose()

        self.doc = self.config.get_parser().fromstring(self.html)
        self.clean_doc = copy.deepcopy(self.doc)

        if self.doc is None:
            # `parse` call failed, return nothing
            return

        # TODO: Fix this, sync in our fix_url() method
        parse_candidate = self.get_parse_candidate()
        self.link_hash = parse_candidate.link_hash  # MD5

        output_formatter = OutputFormatter(self.config)

        title = self.extractor.get_title(self.clean_doc)
        self.set_title(title)

        authors = self.extractor.get_authors(self.clean_doc)
        self.set_authors(authors)

        meta_lang = self.extractor.get_meta_lang(self.clean_doc)
        self.set_meta_language(meta_lang)

        if self.config.use_meta_language:
            self.extractor.update_language(self.meta_lang)
            output_formatter.update_language(self.meta_lang)

        meta_favicon = self.extractor.get_favicon(self.clean_doc)
        self.set_meta_favicon(meta_favicon)

        meta_description = \
            self.extractor.get_meta_description(self.clean_doc)
        self.set_meta_description(meta_description)

        canonical_link = self.extractor.get_canonical_link(
            self.url, self.clean_doc)
        self.set_canonical_link(canonical_link)

        tags = self.extractor.extract_tags(self.clean_doc)
        self.set_tags(tags)

        meta_keywords = self.extractor.get_meta_keywords(
            self.clean_doc)
        self.set_meta_keywords(meta_keywords)

        meta_data = self.extractor.get_meta_data(self.clean_doc)
        self.set_meta_data(meta_data)

        self.publish_date = self.extractor.get_publishing_date(
            self.url,
            self.clean_doc)

        if clean_doc:
            document_cleaner = DocumentCleaner(self.config)
            # Before any computations on the body, clean DOM object
            self.doc = document_cleaner.clean(self.doc)
        else:
            # Use the extended cleaner that does not remove certain dom elements
            document_cleaner = Cleaner(self.config)
            # Before any computations on the body, clean DOM object
            self.doc = document_cleaner.clean(self.doc)

        self.top_node = self.extractor.calculate_best_node(self.doc)
        if self.top_node is not None:
            video_extractor = VideoExtractor(self.config, self.top_node)
            self.set_movies(video_extractor.get_videos())

            self.top_node = self.extractor.post_cleanup(self.top_node)
            self.clean_top_node = copy.deepcopy(self.top_node)

            text, article_html = output_formatter.get_formatted(
                self.top_node)
            self.set_article_html(article_html)
            self.set_text(text)

        self.fetch_images()

        self.is_parsed = True
        self.release_resources()
