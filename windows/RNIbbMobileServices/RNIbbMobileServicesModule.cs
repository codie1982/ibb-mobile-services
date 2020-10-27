using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Ibb.Mobile.Services.RNIbbMobileServices
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNIbbMobileServicesModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNIbbMobileServicesModule"/>.
        /// </summary>
        internal RNIbbMobileServicesModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNIbbMobileServices";
            }
        }
    }
}
