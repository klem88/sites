(function(){
	var books;
	var datafile = '/catalog/scope.json';

	function initdb(reset) {
		db = new loki('scope.db');
		books = db.addCollection('books',['source']);
	}


	function initialize() {
		initdb();
	}

	function load_data() {
		$.ajax({
			dataType:'json',
			url: datafile,
			success: (data) => {
				if (data) {
					books.insert(data);
					// console.log(books);
					$(document).trigger('scope_ready');
				}
			}
		})
	}

	this.Scope = window.Scope || {
		ready: (callback) => {
			$(document).on('scope_ready',callback);

			initdb();
			load_data();
		},

		getTree: (callback,source) => {
			var sort = 'weight';
			var view = books.chain().find();

			view.where((obj)=>{
				return obj.source == source;
			});

			view.simplesort(sort,true);

			// $.each(view.data(), (idx,item) => { callback(item); });
			callback(view.data());
		}

	} 	
	
}).call(this);